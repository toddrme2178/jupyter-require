/**
 * Jupyter require core module
 *
 * @module
 * @summary     Require
 * @description Jupyter library and magic extension for managing linked JavaScript and CSS scripts and styles.
 * @version     0.1.0
 * @file        require/core.js
 * @author      Marek Cermak
 * @contact     macermak@redhat.com
 * @copyright   Copyright 2019 Marek Cermak <macermak@redhat.com>
 *
 * This source file is free software, available under the following license:
 *   MIT license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: https://github.com/CermakM/jupyter-require
 */


define([
    'underscore',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/notebook',
    './display'
], function(_, Jupyter, events, notebook, display) {
    'use strict';

    let Notebook = notebook.Notebook;

    /**
     * Get running cells
     */
    Notebook.prototype.get_running_cells = function() {
        let cells = this.get_cells();

        return cells.filter((c) => c.running);
    };

    /**
     * Get running cell indices
     */
    Notebook.prototype.get_running_cells_indices = function() {
        let cells = this.get_cells();

        return cells.filter((c) => c.running).map((c, i) => i);
    };


    /**
     * Get currently executed cell
     *
     * @returns {CodeCell}
     */
    function get_executed_cell() {
        let cell = Jupyter.notebook.get_running_cells()[0];

        if (!cell) {
            // fallback, may select wrong cell but better than die out
            let selected_cell = Jupyter.notebook.get_selected_cell();
            let prev_cell = Jupyter.notebook.get_prev_cell(selected_cell);

            cell = selected_cell.cell_type === 'code' ? selected_cell : prev_cell;
        }

        return cell;
    }

    /**
     * Get notebook requireJS config
     *
     * @returns {Object} - requirejs configuration object
     */
    function get_notebook_config() { return Jupyter.notebook.metadata.require || {}; }

    /**
     * Set notebook requireJS config
     *
     * @param config {Object} - requirejs configuration object
     */
    function set_notebook_config(config) { Jupyter.notebook.metadata.require = config; }

    /**
     * Asynchronous Function constructor
     */
    let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;


    /**
     * Get cell requirement metadata
     *
     * @param cell {CodeCell} - notebook cell
     */
    function get_cell_requirements(cell) { return cell.metadata.require || []; }


    /**
     * Set cell requirement metadata
     *
     * @param cell {CodeCell} - notebook cell to update metadata
     * @param required {Object} - requirements config object
     */
    function set_cell_requirements(cell, required) { cell.metadata.require = required; }


    /**
     *  Check cell requirements
     * @param required {Array} - array of requirements
     * @returns {Array}
     */
    function check_requirements(required) {
        console.debug("Checking required libraries: ", required);

        let defined = [];  // array of promises

        required.forEach( (lib) => {

            let p = new Promise((resolve, reject) => {

                let iid, tid;

                let callback = function() {
                    clearTimeout(tid);
                    clearInterval(iid);

                    resolve(`Library '${lib}' has been linked.`);
                };
                let errback = function() {
                    clearInterval(iid);

                    reject(`Library '${lib}' could not be loaded.`);
                };

                tid = setTimeout(errback, 5000);
                iid = setInterval(() => require([lib], callback), 250);

            });

            defined.push(p);
        });

        return defined;
    }

    /**
     * Handle error and output it to the notebook cell
     * @param error
     */
    function handle_error(error) {
        console.error(error);

        let traceback = error.stack ? error.stack.split('\n') : [""];

        const output_error = {
            ename: 'JupyterRequireError',
            evalue: error.message || error,
            traceback: traceback,
            output_type: 'error'
        };
        let cell = Jupyter.notebook.get_selected_cell();

        // append stack trace to the cell output element
        cell.output_area.append_output(output_error);
    }

    /**
     * Load required libraries
     *
     * This function pauses execution of Jupyter kernel
     * until require libraries are loaded
     *
     * @param config {Object}  - requirejs configuration object
     */
    async function load_required_libraries (config) {
        console.debug('Require config: ', config);

        let libs = config.paths;

        if ($.isEmptyObject(libs)) {
            return Promise.resolve("No libraries to load.");
        }

        console.log("Loading required libraries:", libs);

        require.config(config);

        console.log("Linking required libraries:", libs);

        let defined = check_requirements(Object.keys(libs));

        return await Promise.all(defined).then(
            (values) => {
                console.log('Success: ', values);
                events.trigger('config.JupyterRequire', {config: config});
            }).catch(handle_error);
    }

    /**
     * Execute function with requirements in an output_area context
     *
     * @param func {Function} - expression to execute
     * @param required {Array} - required libraries
     * @param output_area {OutputArea} - current code cell's output area
     * @returns {Promise<any>}
     */
    function execute_with_requirements(func, required, output_area) {
        return new Promise(async (resolve, reject) => {
            let element = display.create_output_subarea(output_area);

            requirejs(required, (...args) => {
                func.apply(output_area, [...args, element])
                    .then(() => {
                        resolve(element);
                    }).catch(reject);
            });
            setTimeout(reject, 5000, new Error("Script execution timeout."));
        });
    }

    /**
     * Wrap and Execute JS script in output_area context
     *
     * This function pauses execution of Jupyter kernel
     * until required libraries are loaded
     *
     * @returns {Function} - wrapped execution partial function
     */
    async function execute_script(script, required, params) {

        // get rid of invalid characters
        params = params.map((p) => p.replace(/[|&$%@"<>()+-.,;]/g, ""));
        // expose element to the user script
        params.push('element');

        let cell = this;  // current CodeCell
        let output_area = cell.output_area;

        let wrapped = new AsyncFunction(...params, script.toString());
        let execute = _.partial(execute_with_requirements, wrapped, required);

        await Promise.all(check_requirements(required))
            .then(async () => {
                display.append_javascript(execute, output_area).then(
                    (r) => console.debug("Output appended.", r)
                );
                events.trigger('require.JupyterRequire', {cell: cell, require: required});
            })
            .catch(handle_error);
    }

    /**
     * Register comms for messages from Python kernel
     *
     */
    function register_targets() {
        let comm_manager = Jupyter.notebook.kernel.comm_manager;

        comm_manager.register_target('execute',
            (comm, msg) => {
                console.debug('Comm: ', comm, 'initial message: ', msg);

                comm.on_msg(async (msg) => {
                    console.debug('Comm: ', comm, 'message: ', msg);

                    // get running cell or fall back to current cell
                    let cell = get_executed_cell();

                    const d = msg.content.data;
                    return await execute_script.call(cell, d.script, d.require, d.parameters);
                });

                console.debug(`Comm 'execute' registered.`);
            }
        );

        comm_manager.register_target('config',
            (comm, msg) => {
                console.debug('Comm: ', comm, 'initial message: ', msg);

                comm.on_msg(async (msg) => {
                    console.debug('Comm: ', comm, 'message: ', msg);
                    return await load_required_libraries(msg.content.data)
                        .then((values) => console.debug(values))
                        .catch(console.error);
                });

                console.debug(`Comm 'config' registered.`);
            }
        );

        comm_manager.register_target('finalize',
            (comm, msg) => {
                console.debug('Comm: ', comm, 'initial message: ', msg);

                comm.on_msg(async () => {
                    events.trigger('finalize.JupyterRequire', {timestamp: _.now()});
                });

                console.debug(`Comm 'config' registered.`);
            }
        );
    }


    return {
        AsyncFunction             : AsyncFunction,

        get_cell_requirements     : get_cell_requirements,
        set_cell_requirements     : set_cell_requirements,

        get_notebook_config       : get_notebook_config,
        set_notebook_config       : set_notebook_config,

        check_requirements        : check_requirements,
        execute_script            : execute_script,
        execute_with_requirements : execute_with_requirements,

        load_required_libraries   : load_required_libraries,

        register_targets          : register_targets,
    };

});
