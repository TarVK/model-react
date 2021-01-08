Data hooks can specify a `forceRefreshTime` which data source can use to determine whether to reload their data. Currently only the DataLoader class makes use of this value.

If the data was loaded later than the given timestamp, the data will automatically be reloaded.

Also notice that specifying a time in the future, will always reload the data source. This way a data loader can be reloaded without having to explicitly mark the data source as dirty. This is particularly useful when working with "virtual data sources" which are described in the next section.
