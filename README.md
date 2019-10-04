# model-react
Model-react provides a simple system to create a data model together with applicable actions for the data (methods), and easily use this data in react components.

There are two main situations when usage of this module could be considered:
- If you render the same data in multiplce places and want to manage the data neatly
- If the data has complex behaviour, possibly separate of any GUI

This module has full TypeScript support, and will work well in a statically typed structured project.
A demo project written in TypeScript can be found in the examples folder, and shows of several useful constructs in models. The result can be [viewed in browser here](http://tarvk.github.io/model-react/examples/build) but is rather silly. Also note that this demo wasn't made mobile friendly, and generally little time was spent on the looks.

# Installation

```
npm install model-react --save
```

# Usage 

The examples described below can be tested here on [codesandbox](https://codesandbox.io/embed/model-react-edlq8).
Simply create a model class by extending model-react's `BaseModel` class, and use `Fields` for any data that a react component should be able to react to. For instance:
```jsx
import {BaseModel, Field} from "model-react";
class MyFieldModel extends BaseModel {
    text = new Field("");

    constructor(text) {
        super();
        this.text.set(text);
    }

    setText(text) {
        this.text.set(text);
    }

    getText() {
        return this.text.get();
    }
}
```

We can then make use of an instance of this model in a functional react component:
```js
import React from "react";
import {useModel} from "model-react";

const MyField = ({myFieldModel})=>{
    const myField = useModel(myFieldModel);
    return <input value={myField.getText()} onChange={e=>myField.setText(e.target.value)} />;
}
```
Now we can render `MyField` with an instance of `MyFieldModel` as a parameter, and it will use and update the data in the model. 

If we were to render two instances of `MyField` with the same model instance, the data would stay synchronised, and both components would automically rerender when one of them changes the value. This is how model-react offers a rather clean and simple way of managing a global, or shared, state in a project.
The model will also make sure to only rerender components when data they use changes, not when an arbitrary field changes.

Performing asynchronous operations also lends itself quite well to this approach:
```jsx
import {BaseModel, Field} from "model-react";
class SearchModel extends BaseModel {
    search = new Field("");
    loading = new Field(false);
    items = ["Hoi", "Hello", "How are you?", "I am fine, you?", "I am fine too", "How are the kids?", "Dead"]
    results = new Field(this.items);

    async setSearch(search) {
        this.loading.set(true);
        this.search.set(search);

        // Emulate some async delay of an api search
        await new Promise(res=>setTimeout(res, 200));

        if(search!=this.search.get()) return;
        
        this.results.set(items.filter(i=>i.includes(search)));
        this.loading.set(false);
    }
    getSearch() {
        return this.search.get();
    }

    isLoading() {
        return this.loading.get();
    }
    getResults() {
        return this.results.get();
    }
}
```

```js
import React from "react";
import {useModel} from "model-react";

const Search = ({searchModel})=>{
    const search = useModel(searchModel);
    const isLoading = search.isLoading();
    return <div>
        <input value={search.getSearch()} onChange={e=>search.setSearch(e.target.value)} />
        {isLoading
            ? <div>Loading</div>
            : search.getResults().map(i=><div key={i}>{i}</div>)
        }
    </div>;
}
```

`useModel` also has a small feature build in, that allows `useModel(context)` to be shorthand for `useModel(useContext(context))` since usage with contexts will be quite common for global states. 

## caveats
### Field binding
<details>
<summary> The `Field` constructor automatically binds a field to the last instanciated model, this means that submodels should be initiated after any fields </summary>

E.G:
```js
import {BaseModel, Field} from "model-react";
import {MyOtherModel} from "./Somewhere";
class MyFieldModel extends BaseModel {
    text = new Field("");
    something = new MyOtherModel();
}
```
will work fine, where as 
```js
import {BaseModel, Field} from "model-react";
import {MyOtherModel} from "./Somewhere";
class MyFieldModel extends BaseModel {
    something = new MyOtherModel();
    text = new Field("");
}
```
will bind `text` to the wrong model. We can also explicetely bind the model to solve this:
```js
import {BaseModel, Field} from "model-react";
import {MyOtherModel} from "./Somewhere";
class MyFieldModel extends BaseModel {
    something = new MyOtherModel();
    text = new Field("", this);
}
```

</details>

### Listener bindings

<details>
<summary> Usage of field getters in update functions might cause unnecessary rerenders </summary>

Whenever a model is used with `mdl = useModel(model)`, the `mdl` instance will register any of the data retrieved, and rerender the component when any of the retrieved data is updated. It might however be that the model internally uses the data to update a field as well, on a async callback like a click event, e.g.:
```js
...
update(){
    this.count.set(this.count.get()+1)
}
```
```jsx
const comp = ()=>{
    mdl = useModel(model);
    return <button onClick={()=>mdl.update()}>Update</button>;
}
```
This means that despite comp not showing the count, it will listen for count changes after the button has been pressed. In order to prevent these unnecessary rerenders, we can simply retrieve rendered data from `mdl` but perform callback on `model`:

```jsx
const comp = ()=>{
    mdl = useModel(model);
    return <button onClick={()=>model.update()}>Update</button>;
}
```

</details>

## Todo List Example
This example does not show the capabilities of model-react too well, but can be useful to get an idea for basic usage. As can be seen, the implementation of the models is rather verbose and large for that reason. This is of course a personal preference.
### TypesSript implementation
<details>
<summary> Code </summary>

```tsx
import ReactDOM from "react-dom";
import React, {FunctionComponent, useState, useCallback} from "react";
import {BaseModel, Field, useModel} from "model-react";

class TodoItemModel extends BaseModel {
    // The text of the item
    protected text = new Field("");

    /**
     * Creates a list item
     * @param text The content of the item
     */
    constructor(text: string) {
        super();
        this.text.set(text);
    }

    /**
     * Sets the text of the item
     * @param text The text
     */
    public setText(text: string): void {
        this.text.set(text);
    }

    /**
     * Retrieves the text of the item
     * @returns The text
     */
    public getText(): string {
        return this.text.get();
    }
}

class TodoListModel extends BaseModel {
    // The items on the todolost
    protected items = new Field([] as TodoItemModel[]);

    /**
     * Retrieves all of the items on the todolist
     * @returns All items
     */
    public getItems(): TodoItemModel[] {
        return this.items.get();
    }

    /**
     * Inserts an item into the todolist
     * @param item The item to insert
     * @returns Whether the item was successfully added (doesn't allow duplicate items)
     */
    public addItem(item: TodoItemModel): boolean {
        const items = this.items.get();

        // Make sure the item isn't already present
        if (items.find(i => i.$equals(item))) return false;

        // Add the item
        this.items.set([...items, item]);
        return true;
    }

    /**
     * Removes an item from the todolist
     * @param item The item to remove
     * @returns Whether the item was present and could be removed
     */
    public removeItem(item: TodoItemModel): boolean {
        const items = this.items.get();

        // Get the items with the item removed
        const remainingItems = items.filter(i => !i.$equals(item));

        // Check if anything was removed
        if (items.length == remainingItems.length) return false;

        // Store the result
        this.items.set(remainingItems);
        return true;
    }
}

const TodoItem: FunctionComponent<{
    todoItemModel: TodoItemModel;
    onDelete: (item: TodoItemModel) => void;
}> = ({todoItemModel, onDelete}) => {
    const todoItem = useModel(todoItemModel);
    return (
        <div>
            <input
                value={todoItem.getText()}
                onChange={e => todoItem.setText(e.target.value)}
            />
            <button onClick={() => onDelete(todoItem)}>Remove</button>
        </div>
    );
};

const Todo: FunctionComponent<{todoListModel: TodoListModel}> = ({todoListModel}) => {
    const todoList = useModel(todoListModel);
    const [insertText, setInsertText] = useState("");
    const onDelete = useCallback((item: TodoItemModel) => todoList.removeItem(item), []);

    return (
        <div>
            <input value={insertText} onChange={e => setInsertText(e.target.value)} />
            <button
                onClick={() => {
                    todoList.addItem(new TodoItemModel(insertText));
                    setInsertText("");
                }}>
                Add
            </button>
            {todoList.getItems().map(item => (
                <TodoItem key={item.$getID()} todoItemModel={item} onDelete={onDelete} />
            ))}
        </div>
    );
};

const todoList = new TodoListModel();
console.log(todoList);
ReactDOM.render(<Todo todoListModel={todoList} />, document.getElementById("root"));
```
</details>

### JavaScript implementation
<details>
<summary> Code </summary>

```jsx
import ReactDOM from "react-dom";
import React, {FunctionComponent, useState, useCallback} from "react";
import {BaseModel, Field, useModel} from "model-react";

class TodoItemModel extends BaseModel {
    // The text of the item
    text = new Field("");

    /**
     * Creates a list item
     * @param text The content of the item
     */
    constructor(text: string) {
        super();
        this.text.set(text);
    }

    /**
     * Sets the text of the item
     * @param {string} text The text
     */
    setText(text) {
        this.text.set(text);
    }

    /**
     * Retrieves the text of the item
     * @returns {string} The text
     */
    getText() {
        return this.text.get();
    }
}

class TodoListModel extends BaseModel {
    // The items on the todolost
    items = new Field([]);

    /**
     * Retrieves all of the items on the todolist
     * @returns {TodoItemModel[]} All items
     */
    getItems() {
        return this.items.get();
    }

    /**
     * Inserts an item into the todolist
     * @param {TodoItemModel} item The item to insert
     * @returns {boolean} Whether the item was successfully added (doesn't allow duplicate items)
     */
    addItem(item) {
        const items = this.items.get();

        // Make sure the item isn't already present
        if (items.find(i => i.$equals(item))) return false;

        // Add the item
        this.items.set([...items, item]);
        return true;
    }

    /**
     * Removes an item from the todolist
     * @param {TodoItemModel} item The item to remove
     * @returns {boolean} Whether the item was present and could be removed
     */
    removeItem(item: TodoItemModel) {
        const items = this.items.get();

        // Get the items with the item removed
        const remainingItems = items.filter(i => !i.$equals(item));

        // Check if anything was removed
        if (items.length == remainingItems.length) return false;

        // Store the result
        this.items.set(remainingItems);
        return true;
    }
}

const TodoItem = ({todoItemModel, onDelete}) => {
    const todoItem = useModel(todoItemModel);
    return (
        <div>
            <input
                value={todoItem.getText()}
                onChange={e => todoItem.setText(e.target.value)}
            />
            <button onClick={() => onDelete(todoItem)}>Remove</button>
        </div>
    );
};

const Todo: = ({todoListModel}) => {
    const todoList = useModel(todoListModel);
    const [insertText, setInsertText] = useState("");
    const onDelete = useCallback((item: TodoItemModel) => todoList.removeItem(item), []);

    return (
        <div>
            <input value={insertText} onChange={e => setInsertText(e.target.value)} />
            <button
                onClick={() => {
                    todoList.addItem(new TodoItemModel(insertText));
                    setInsertText("");
                }}>
                Add
            </button>
            {todoList.getItems().map(item => (
                <TodoItem key={item.$getID()} todoItemModel={item} onDelete={onDelete} />
            ))}
        </div>
    );
};

const todoList = new TodoListModel();
console.log(todoList);
ReactDOM.render(<Todo todoListModel={todoList} />, document.getElementById("root"));
```
</details>

# Contributing

Any contributions are welcome

## Environment setup

within both the main directory and examples run:
```
yarn install
```

## Environment usage
To test your code, in both the main directory and examples run:
```
yarn start
```
This will start a dev server at localhost:3000 to view the examples which make use of the written code

To build the module or the examples for production, in either folder run:
```
yarn build
```