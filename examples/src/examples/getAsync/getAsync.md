The `getAsync` function can be used to convert a data retriever / data source into a promise. Data sources always return some value straight away, but they may indicate they are still working on loading their data.

When converted to a promise, the promise won't resolve as long as the data is still being loaded. Only once the data finished loading, the final result will be returned from the promise.
If the data source resulted in any errors, these are thrown instead.
