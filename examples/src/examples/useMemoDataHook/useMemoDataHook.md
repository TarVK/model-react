The useMemoDataHook is as the name implies, a combination of useDataHook and useMemo. It can be used in situations where you don't want to recompute data on every rerender, but still want to subscribe to the source data.

The naive usage of useDataHook and useMemo may not work as you might expect. Dependencies are removed on every rerender of a component, meaning that if a component rerenders but your memoized data doesn't recompute, you're no longer subscribed to that data. See [issue 40](https://github.com/TarVK/model-react/issues/40) for more information.
