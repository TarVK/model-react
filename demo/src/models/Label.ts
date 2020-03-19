import {Field, IDataHook} from "model-react";

export class Label {
    public ID = Math.floor(Math.random() * 1e6);

    // The text of the label
    protected text = new Field("");

    /**
     * Retrieves the text of the label
     * @param h The data hook
     * @returns The text
     */
    public getText(h: IDataHook): string {
        return this.text.get(h);
    }

    /**
     * Sets the text of the label
     * @param text The text
     */
    public setText(text: string) {
        this.text.set(text);
    }
}
