Sometimes it's useful to keep track of whether some process, like saving data, is executing already.
The `ExecutionState` data source allows you to keep track of whether asynchronous functions are still processing.

Simply add a function or promise to this data source, and the getter function will tell whether any functions are still processing. In addition, the loading state will be set if it's still processing.
