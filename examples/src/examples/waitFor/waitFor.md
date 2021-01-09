The `waitFor` function serves a similar purpose to the `getAsync` function, but rather than waiting for the data source to stop loading, it waits for an arbitrary condition.

This function can be used to formulate a predicate that you know must hold at some point in the future, and simply wait for that point to be reached.
