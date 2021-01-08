A powerful mechanic resulting directly from the base principle of model-react itself, is the ability to create "virtual data sources". One can simply create a function, which post processes the result of one or more other data sources.

```tsx
const getFullName = (h: IDataHook) => {
    const name = person.getName(h);
    const surname = person.getSurname(h);
    return `${name} ${surname}`;
};
```

When properly forwarding the hook from this function to used data sources, this virtual data source will act as if it's a data source itself. This allows you to easily define properties in terms of other properties, and making sure the values always remain up to date.
