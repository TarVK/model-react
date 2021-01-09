Hooks provide callback functions to be called by data sources. But it is possible that these callbacks themselves result in an error.

By default these errors are simply logged to the console, but a function is provided to alter this behavior.
