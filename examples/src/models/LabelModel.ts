import {BaseModel, Field} from "model-react";

export class LabelModel extends BaseModel {
    // The text of the label
    protected text = new Field("");

    /**
     * Retrieves the text of the label
     * @returns The text
     */
    public getText(): string {
        return this.text.get();
    }

    /**
     * Sets the text of the label
     * @param text The text
     */
    public setText(text: string) {
        this.text.set(text);
    }
}
