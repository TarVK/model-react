import {Picture} from "./Picture";
import {User} from "./User";
import {Label} from "./Label";
import {PictureSearch} from "./PictureSearch";
import {Field, IDataRetrieverParams} from "model-react";

class Application {
    // The pictures loaded in the application
    protected pictures = new Field([] as Picture[]);

    // All the specified labels within the application
    protected labels = new Field([] as Label[]);

    // Whether or not the picture search is visible
    protected pictureSearchOpened = new Field(false);

    // Store the selected picture
    protected selectedPicture = new Field(null as Picture);

    // The picture we are selecting a label for
    protected pictureToAddLabelTo = new Field(null as Picture);

    /**
     * Always declare instances of other models below all fields
     */
    // The data about the picture being searched
    protected pictureSearch = new PictureSearch();

    // The user of the application
    protected user = new User();

    // Picture label adding
    /**
     * Set the picture to add a picture to
     * @param Picture The target picture
     */
    public setLabelTarget(picture: Picture): void {
        this.pictureToAddLabelTo.set(picture);
    }

    /**
     * Whether or not we have a target to add a label to
     * @param p The retrieval parameters for the data
     * @returns Whether we should display label selection
     */
    public isLabeling(p?: IDataRetrieverParams): boolean {
        return this.pictureToAddLabelTo.get(p) != null;
    }

    /**
     * Selects the picture
     * @param label The label to add
     */
    public addLabelToPicture(label: Label): void {
        if (this.pictureToAddLabelTo.get() && label)
            this.pictureToAddLabelTo.get().addLabel(label);
        this.pictureToAddLabelTo.set(null);
    }

    // Picture search management
    /**
     * Retrieves whether the picture search is opeened
     * @param p The retrieval parameters for the data
     * @returns Whether opened
     */
    public isPictureSearchOpened(p?: IDataRetrieverParams): boolean {
        return this.pictureSearchOpened.get(p);
    }

    /**
     * Sets whether or not the picture search is opened
     * @param opened Whether opened
     */
    public setPictureSearchOpened(opened: boolean = true): void {
        this.pictureSearchOpened.set(opened);
        if (!opened) {
            this.pictureSearch.setTarget(null);
            this.pictureSearch.setSearch("");
            this.pictureSearch.performSearch();
        }
    }

    // Picture selection
    /**
     * Sets the selected picture
     * @param Picture The picture to select
     */
    public selectPicture(picture: Picture): void {
        // Only allow stored pictures to be selected
        if (!this.getPictures().includes(picture)) return;

        this.selectedPicture.set(picture);
    }

    /**
     * Retrieves the selected picture
     * @param p The retrieval parameters for the data
     * @returns The selected picture
     */
    public getSelectedPicture(p?: IDataRetrieverParams): Picture {
        return this.selectedPicture.get(p);
    }

    // Picture management
    /**
     * Retrieves the pictures in the app
     * @param p The retrieval parameters for the data
     * @returns The pictures
     */
    public getPictures(p?: IDataRetrieverParams): Picture[] {
        return this.pictures.get(p);
    }

    /**
     * Adds a picture to the set
     * @param picture The picture to add
     */

    public addPicture(picture: Picture): void {
        this.pictures.set([picture, ...this.pictures.get()]);

        // Select this picture if nothing is selected
        const selectedPicture = this.getSelectedPicture();
        if (!selectedPicture) this.selectPicture(picture);
    }

    /**
     * Removes a picture from the set
     * @param picture The picture to remove
     */
    public removePicture(picture: Picture): void {
        const remainingPictures = this.pictures.get().filter(p => p !== picture);
        this.pictures.set(remainingPictures);

        // Select another picture if this picture was selected
        if (picture && picture == this.getSelectedPicture()) {
            const selectPicture = remainingPictures[0];
            if (selectPicture) this.selectPicture(selectPicture);
        }
    }

    // Label management
    /**
     * Retrieves all declared labels
     * @param p The retrieval parameters for the data
     * @returns The labels
     */
    public getLabels(p?: IDataRetrieverParams): Label[] {
        return this.labels.get(p);
    }

    /**
     * Adds a label to the set
     * @param label The label to add
     */
    public addLabel(label: Label): void {
        this.labels.set([label, ...this.labels.get()]);
    }

    /**
     * Remove a label from the set
     * @param label The label to remove
     */
    public removeLabel(label: Label): void {
        this.labels.set(this.labels.get().filter(l => l != label));
    }

    // Model retrieval methods
    /**
     * Retrieves the model for the user of the application
     * @returns The user
     */
    public getUser(): User {
        return this.user;
    }

    /**
     * Retrieves the model for the picture search of the application
     * @returns The picture search
     */
    public getPictureSearch(): PictureSearch {
        return this.pictureSearch;
    }
}
export const application = new Application();
