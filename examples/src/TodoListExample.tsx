import ReactDOM from "react-dom";
import React, {FunctionComponent, useState, useCallback} from "react";
import {Field, IDataRetrieverParams, useDataHook} from "model-react";

// This example doesn't demonstrate the benefits of the system well, but it's a small example that might be easier to grasp.

class TodoItem {
    public ID = Math.floor(Math.random() * 1e6);

    // The text of the item
    protected text = new Field("");

    /**
     * Creates a list item
     * @param text The content of the item
     */
    constructor(text: string) {
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
     * @param p The retrieval parameters for the data
     * @returns The text
     */
    public getText(p?: IDataRetrieverParams): string {
        return this.text.get(p);
    }
}

class TodoList {
    // The items on the todolost
    protected items = new Field([] as TodoItem[]);

    /**
     * Retrieves all of the items on the todolist
     * @param p The retrieval parameters for the data
     * @returns All items
     */
    public getItems(p?: IDataRetrieverParams): TodoItem[] {
        return this.items.get(p);
    }

    /**
     * Inserts an item into the todolist
     * @param item The item to insert
     * @returns Whether the item was successfully added (doesn't allow duplicate items)
     */
    public addItem(item: TodoItem): boolean {
        const items = this.items.get();

        // Make sure the item isn't already present
        if (items.includes(item)) return false;

        // Add the item
        this.items.set([...items, item]);
        return true;
    }

    /**
     * Removes an item from the todolist
     * @param item The item to remove
     * @returns Whether the item was present and could be removed
     */
    public removeItem(item: TodoItem): boolean {
        const items = this.items.get();

        // Get the items with the item removed/
        const remainingItems = items.filter(i => i !== item);

        // Check if anything was removed
        if (items.length == remainingItems.length) return false;

        // Store the result
        this.items.set(remainingItems);
        return true;
    }
}

const TodoItemComp: FunctionComponent<{
    todoItem: TodoItem;
    onDelete: (item: TodoItem) => void;
}> = ({todoItem, onDelete}) => {
    const [l] = useDataHook();
    return (
        <div>
            <input
                value={todoItem.getText(l)}
                onChange={e => todoItem.setText(e.target.value)}
            />
            <button onClick={() => onDelete(todoItem)}>Remove</button>
        </div>
    );
};

const TodoComp: FunctionComponent<{todoList: TodoList}> = ({todoList}) => {
    const [l] = useDataHook();
    const [insertText, setInsertText] = useState("");
    const onDelete = useCallback((item: TodoItem) => todoList.removeItem(item), []);

    return (
        <div>
            <input value={insertText} onChange={e => setInsertText(e.target.value)} />
            <button
                onClick={() => {
                    todoList.addItem(new TodoItem(insertText));
                    setInsertText("");
                }}>
                Add
            </button>
            {todoList.getItems(l).map(item => (
                <TodoItemComp key={item.ID} todoItem={item} onDelete={onDelete} />
            ))}
        </div>
    );
};

export function renderTodo() {
    const todoList = new TodoList();
    console.log(todoList);
    ReactDOM.render(<TodoComp todoList={todoList} />, document.getElementById("root"));
}
