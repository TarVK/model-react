import {BaseModel, Field, Observable} from "model-react";
import {LabelModel} from "./LabelModel";
import {ApplicationModel} from "./ApplicationModel";
import {UserModel} from "./UserModel";

export class PictureModel extends BaseModel {
    // A subset of all labels of the application
    protected labels = new Field([] as Observable<LabelModel>[]);

    // Some random property as an example
    protected labelLengthSum = new Field(0);

    // The actual picture
    protected picture = new Field(null as string);

    // The name of the picture
    protected name = new Field("");

    // The author of the picture
    protected author: UserModel;

    /**
     * Creates a picture
     * @param author The author of the picture
     * @param picture The picture itself
     * @param name The name of the picture
     */
    constructor(author: UserModel, picture: string, name: string) {
        super();

        // Update the label length sum whenever a label is added or removed
        this.labels.addListener(this.updateLabelLengthSum);

        // Bind the user model to this model, to correctly send updates when data changes
        this.author = this.$bindModel(author);

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
     * @returns The name
     */
    public getName(): string {
        return this.name.get();
    }

    /**
     * Retrieves the author name
     * @returns The name
     */
    public getAuthorName(): string {
        return this.author.getName();
    }

    /**
     * Retrieves a full title of the image including author
     * @returns The title of the image
     */
    public getTitle(): string {
        return `${this.getName()} by ${this.getAuthorName()}`;
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
    public getPicture(): string {
        return this.picture.get();
    }

    // Label management
    /**
     * Updates the sum of the label lengths
     */
    protected updateLabelLengthSum = () => {
        this.labelLengthSum.set(
            this.getLabels().reduce((p, l) => l.getText().length + p, 0)
        );
    };

    /**
     * Removes any of the labels that are not in the application anymore
     */
    protected filterLabels = () => {
        const applicationLabels = this.application.getLabels();
        const labels = this.labels.get();

        const removeLabels = labels.filter(
            l => !applicationLabels.find(al => al.$equals(l))
        );
        removeLabels.forEach(l => this.removeLabel(l));
    };

    // Store an observable application, to retrieve all the labels
    protected application = ApplicationModel.$getObservableModel(this.filterLabels);

    /**
     * Retrieves all declared labels
     * @returns The labels
     */
    public getLabels(): LabelModel[] {
        return this.labels.get();
    }

    /**
     * Adds a label to the set
     * @param label The label to add
     */
    public addLabel(label: LabelModel): void {
        // Create an observable instance that recomputes the label length sum when updated
        const observableLabel = label.$getObservableModel(this.updateLabelLengthSum);

        // Check if the label isn't present
        const labels = this.labels.get();
        if (labels.find(l => l.$equals(label))) return;

        // Insert the label
        this.labels.set([observableLabel, ...labels]);

        // Make sure the label is allowed
        this.filterLabels();
    }

    /**
     * Remove a label from the set
     * @param label The label to remove
     */
    public removeLabel(label: LabelModel): void {
        const labels = this.labels.get();

        /* Find and filter using $equals, 
        since we created our own observable instance of the label when inserting */

        // Find our label to destroy the observable instance
        const observableLabel = labels.find(l => l.$equals(label));
        if (observableLabel) observableLabel.$destroy();

        // Remove it from our labels
        this.labels.set(labels.filter(l => !l.$equals(label)));
    }

    /**
     * Retrieves the sum of label lengths
     * @returns The sum
     */
    public getLabelLengthSum(): number {
        return this.labelLengthSum.get();
    }
}
