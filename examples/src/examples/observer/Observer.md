The observer class can be used to listen for value or status change events of data sources.
They take in a data retriever, and allow listeners to be added to listen for that data.

The listeners are called with 3 arguments:

-   The current data retriever value
-   State metadata
-   The value from before this change

By default observers debounce hooks for 0 milliseconds, making sure that any changes that happen in the same millisecond are ignored (except for the last one). This debounce time can be changed and disabled however.

When the observer is no longer needed, it can be destroyed in order to remove all of its hooks.
