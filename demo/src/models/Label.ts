import {Field, IDataRetrieverParams} from "model-react";

export class Label {
    public ID = Math.floor(Math.random() * 1e6);

    // The text of the label
    protected text = new Field("");

    /**
     * Retrieves the text of the label
     * @param p The retrieval parameters for the data
     * @returns The text
     */
    public getText(p?: IDataRetrieverParams): string {
        return this.text.get(p);
    }

    /**
     * Sets the text of the label
     * @param text The text
     */
    public setText(text: string) {
        this.text.set(text);
    }
}
