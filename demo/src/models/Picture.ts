import {Field, IDataRetrieverParams} from "model-react";
import {Label} from "./Label";
import {application} from "./application";
import {User} from "./User";

export class Picture {
    public ID = Math.floor(Math.random() * 1e6);

    // A subset of all labels of the application
    protected labels = new Field([] as Label[]);

    // The actual picture
    protected picture = new Field(null as string);

    // The name of the picture
    protected name = new Field("");

    // The author of the picture
    protected author: User;

    /**
     * Creates a picture
     * @param author The author of the picture
     * @param picture The picture itself
     * @param name The name of the picture
     */
    constructor(author: User, picture: string, name: string) {
        this.author = author;
        this.picture.set(picture);
        this.name.set(name);
    }

    // Name management
    /**
     * Sets the name of the picture
     * @param name The name
     */
    public setName(name: string): void {
        this.name.set(name);
    }

    /**
     * Retrieves the name of the picture
     * @param p The retrieval parameters for the data
     * @returns The name
     */
    public getName(p?: IDataRetrieverParams): string {
        return this.name.get(p);
    }

    /**
     * Retrieves the author name
     * @param p The retrieval parameters for the data
     * @returns The name
     */
    public getAuthorName(p?: IDataRetrieverParams): string {
        return this.author.getName(p);
    }

    /**
     * Retrieves a full title of the image including author
     * @param p The retrieval parameters for the data
     * @returns The title of the image
     */
    public getTitle(p?: IDataRetrieverParams): string {
        return `${this.getName(p)} by ${this.getAuthorName(p)}`;
    }

    // Picture management
    /**
     * Sets the picture to use
     * @param picture The picture
     */
    public setPicture(picture: string): void {
        this.picture.set(picture);
    }

    /**
     * Retrieves the picture to use
     * @returns The picture
     */
    public getPicture(p?: IDataRetrieverParams): string {
        return this.picture.get(p);
    }

    // Label management
    /**
     * Retrieves all declared labels
     * @param p The retrieval parameters for the data
     * @returns The labels
     */
    public getLabels(p?: IDataRetrieverParams): Label[] {
        // Retrieved the attached labels that aren't removed from the application yet
        const allLabels = application.getLabels(p);
        const thisLabels = this.labels.get(p);
        const presentLabels = thisLabels.filter(label => allLabels.includes(label));

        // Remove any labels that don't exist anymore for good
        if (presentLabels.length !== thisLabels.length) this.labels.set(presentLabels);

        // Return the labels that still exist
        return presentLabels;
    }

    /**
     * Adds a label to the set
     * @param label The label to add
     */
    public addLabel(label: Label): void {
        // Verify the label isn't present already
        const labels = this.labels.get();
        if (labels.includes(label)) return;

        // Insert the label
        this.labels.set([label, ...labels]);
    }

    /**
     * Remove a label from the set
     * @param label The label to remove
     */
    public removeLabel(label: Label): void {
        const labels = this.labels.get();
        this.labels.set(labels.filter(l => l !== label));
    }

    /**
     * Retrieves the sum of label lengths
     * @param p The retrieval parameters for the data
     * @returns The sum
     */
    public getLabelLengthSum(p?: IDataRetrieverParams): number {
        return this.labels
            .get(p)
            .reduce((total, label) => total + label.getText(p).length, 0);
    }
}
