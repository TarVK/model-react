import {BaseModel, Field} from "model-react";
import {PictureModel} from "./PictureModel";
import {UserModel} from "./UserModel";
import {LabelModel} from "./LabelModel";
import {PictureSearchModel} from "./PictureSearchModel";

export const ApplicationModel = new (class Application extends BaseModel {
    // The pictures loaded in the application
    protected pictures = new Field([] as PictureModel[]);

    // All the specified labels within the application
    protected labels = new Field([] as LabelModel[]);

    // Whether or not the picture search is visible
    protected pictureSearchOpened = new Field(false);

    // Store the selected picture
    protected selectedPicture = new Field(null as PictureModel);

    // The picture we are selecting a label for
    protected pictureToAddLabelTo = new Field(null as PictureModel);

    /**
     * Always declare instances of other models below all fields
     */
    // The data about the picture being searched
    protected pictureSearch = new PictureSearchModel();

    // The user of the application
    protected user = new UserModel();

    // Picture label adding
    /**
     * Set the picture to add a picture to
     * @param Picture The target picture
     */
    public setLabelTarget(picture: PictureModel): void {
        this.pictureToAddLabelTo.set(picture);
    }

    /**
     * Whether or not we have a target to add a label to
     * @returns Whether we should display label selection
     */
    public isLabeling(): boolean {
        return this.pictureToAddLabelTo.get() != null;
    }

    /**
     * Selects the picture
     * @param label The label to add
     */
    public addLabelToPicture(label: LabelModel): void {
        if (this.pictureToAddLabelTo.get() && label)
            this.pictureToAddLabelTo.get().addLabel(label);
        this.pictureToAddLabelTo.set(null);
    }

    // Picture search management
    /**
     * Retrieves whether the picture search is opeened
     * @returns Whether opened
     */
    public isPictureSearchOpened(): boolean {
        return this.pictureSearchOpened.get();
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
    public selectPicture(picture: PictureModel): void {
        // Only allow stored pictures to be selected
        if (!this.getPictures().find(p => p.$equals(picture))) return;

        this.selectedPicture.set(picture);
    }

    /**
     * Retrieves the selected picture
     * @returns The selected picture
     */
    public getSelectedPicture(): PictureModel {
        return this.selectedPicture.get();
    }

    // Picture management
    /**
     * Retrieves the pictures in the app
     * @returns The pictures
     */
    public getPictures(): PictureModel[] {
        return this.pictures.get();
    }

    /**
     * Adds a picture to the set
     * @param picture The picture to add
     */

    public addPicture(picture: PictureModel): void {
        this.pictures.set([picture, ...this.pictures.get()]);

        // Select this picture if nothing is selected
        const selectedPicture = this.getSelectedPicture();
        if (!selectedPicture) this.selectPicture(picture);
    }

    /**
     * Removes a picture from the set
     * @param picture The picture to remove
     */
    public removePicture(picture: PictureModel): void {
        const remainingPictures = this.pictures.get().filter(p => !p.$equals(picture));
        this.pictures.set(remainingPictures);

        // Select another picture if this picture was selected
        if (picture && picture.$equals(this.getSelectedPicture())) {
            const selectPicture = remainingPictures[0];
            if (selectPicture) this.selectPicture(selectPicture);
        }
    }

    // Label management
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
        this.labels.set([label, ...this.labels.get()]);
    }

    /**
     * Remove a label from the set
     * @param label The label to remove
     */
    public removeLabel(label: LabelModel): void {
        this.labels.set(this.labels.get().filter(l => l != label));
    }

    // Model retrieval methods
    /**
     * Retrieves the model for the user of the application
     * @returns The user
     */
    public getUser(): UserModel {
        return this.user;
    }

    /**
     * Retrieves the model for the picture search of the application
     * @returns The picture search
     */
    public getPictureSearch(): PictureSearchModel {
        return this.pictureSearch;
    }
})();
