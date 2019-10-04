import ReactDOM from "react-dom";
import React, {FunctionComponent, useState, useCallback} from "react";
import {BaseModel, Field, useModel} from "model-react";

// This example doesn't demonstrate the benefits of the system well, but it's a small example that might be easier to grasp.

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

export function renderTodo() {
    const todoList = new TodoListModel();
    console.log(todoList);
    ReactDOM.render(<Todo todoListModel={todoList} />, document.getElementById("root"));
}
