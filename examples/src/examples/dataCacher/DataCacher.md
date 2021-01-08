One of the downsides of virtual data sources, is that values have to be recomputed every time they are requested. Depending on how heavy this computation is, and how often the data is requested, this can be very inefficient.

The DataCacher class can be used to wrap a virtual data source and cache its results for future usage. The cache will automatically be invalidated when the source data it uses changes. It will also properly forward data to hooks.

The data cacher is in essence entirely transparent. A virtual data source wrapped in a cacher behaves exactly the same as the virtual data source itself, except it's more efficient. This is however assuming the virtual data source is side-effect free and deterministic.
