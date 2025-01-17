
## Release 0.3.0 (2019-07-23T08:29:16)
* [0.3.0-rc1] New minor release candidate
* Trigger events before and after finalization
* [0.3.0-rc] New minor release candidate
* Avoid deadlock on requirejs module loading error
* No need to use RegExp in syntax highlighting
* Fix syntax highlighting
* Change regex for syntax highlighting to `requirejs`
* API changes:
* Fix `link_js` script existence check
* Fix syntax highlighting in %%require cells
* Add `get_executed_cell` to Notebook prototype
* Pass context to the script being executed
* Fix `link_js` invalid condition
* Turn `requrie` into line_cell_magic
* Bump version
* Remove empty parameters from AsyncFunction
* Remove Pipfile.lock
* Bump version
* Jupyter-tools has become jupyter-nbutils package
* Fix typo in %%define
* Bump version
* Do not re-throw a script error to prevent kernel crash
* Bump version
* Magic to define new modules in-place
* Magic to reload linked libraries
* Do not re-link already linked styles and scripts
* Don't forget to pop library from LIBS on undef
* Magic to undefine linked modules
* Add cell magic to execute JS script directly
* Bump version
* Rename magic to comply with python API
* Fix incorrect imports and typo in requirements
* Add option to compress CSS before loading
* Move utilities from core to notebook module
* Link font awesome CSS and fix invisible icon
* Bump version
* Fix install instructions
* Link font awesome CSS on nbextension initialization
* Do not throw error if comm is not defined yet
* Bump version
* Dependency maintenance
* Modify install instructions in README.rst
* Wait for kernel and handle invalid user script
* Clean requirements properly in require.reload()
* Format error messages instead of returning objects
* Check if output has metadata
* Refactor core.py and stringify error traceback
* Fix reload with clear=True
* JSON.stringify error object
* Fix `load_js` duplicated script parameter
* Fix README extension in MANIFEST.in
* Remove leftover from preparation to node migration
* Update description
* Update README to reflect utils migration
* Bump version
* Move utils module to jupyter-tools
* Bump version
* Correct links in the resource table
* Replace raw directive
* Correct spelling grammar using grammarly
* Change content type for PyPI to render properly
* Rename to README.rst for GitHub to parse correctly
* Remove README.md
* Migrate README to .rst
* Bump version
* Update README.md
* Isolate scope of embedded safe scripts
* Bump version
* Finalize only once and select valid code cells
* Bump version
* Utilities to install jupyter-require extension
* Bump version
* Position the action button and change icon
* Introduce Save and Finalize action button
* Bump version
* Refactor Python-JS communication and logging
* Bump version
* Set correct output area element width
* Bump version
* Bidirectional communication
* Bump version
* Implement `safe_execute` method for persistent scripts
* Bump version
* Outputs are saved on kernel related events and proper close
* Enable copy/pasting for jupyter-require cells
* Persistens outputs in static frozen state
* Freeze and store cell output on save event
* Selected correct cell for requirement metadata
* Store outputs as display metadata
* Remove event manager completely
* Refactor event manager
* Replace `display` with `execute_with_requirements`
* Bump version
* Custom async execution and output
* [WIP] Custom async execution and output
* [WIP] Custom async execution and output
* [WIP] Custom async execution and output
* Bump version
* Execute JS scripts via comms
* Bump version
* Add module with common notebook utilities.
* Set only non-empty requirement metadata
* Temporary fix before node.js migration
* Bump version
* Conform to nbextension ipywidgets-like structure
* [WIP] Conform to nbextension ipywidgets-like structure
* Include events module dependency in main extension file
* Bump version
* Persistend requireJS requirements and cell updates
* [WIP] nbextension
* Bump version
* Use jupyter comms and promises to await required libs
* Bump version
* Allow additional attributes in link_css function
* Fix typo in summary
* Bump version
* Fix require arguments
* Bump version
* Give timeout before loading libraries
* Get rid of spectate and call update manually
* Bump version
* Move execute_js from jupyter_d3 to jupyter_require module
* Bump version
* Update README
* Bump version
* Fix setup.py to cope with PyPI
* Bump version
* Update README to reflect naming changing
* Bump version
* Load modules directly after linking
* Remove excessive print
* Rename package to jupyter_require to prevent clashes with require
* Fix typo in `require`
* Link modules properly
* Refactorings
* Update README
* Bump version
* Pass path properly and add setup calssifiers
* Bump version
* Move magic into separate module
* Add virtual environments to .gitignore
* Add requirements files
* Add setuptools and __about__ module
* Rename to jupyter-require
* Ported from https://github.com/CermakM/jupyter-d3
