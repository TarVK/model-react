import {BaseModel, Field} from "model-react";
import {PictureModel} from "./PictureModel";
import {ApplicationModel} from "./ApplicationModel";

type Image = {picture: string; name: string};
export class PictureSearchModel extends BaseModel {
    // The text currently being searched for
    protected search = new Field("");

    // The search results
    protected results = new Field([] as Image[]);

    // Any error message if the search failed
    protected searchError = new Field(null as string);

    // Whether or not the search is loading
    protected loading = new Field(false);

    // The picture that we want to change
    protected pictureToChange: PictureModel;

    // Picture assignment
    /**
     * Set the picture to update
     * @param Picture The target picture
     */
    public setTarget(picture: PictureModel): void {
        this.pictureToChange = picture;
    }

    /**
     * Selects the picture
     * @param index The index to select
     */
    public selectPicture(index: number): void {
        const picture = this.getPictures()[index];
        if (!picture) return;

        if (this.pictureToChange) {
            this.pictureToChange.setPicture(picture.picture);
        } else {
            ApplicationModel.addPicture(
                new PictureModel(
                    ApplicationModel.getUser(),
                    picture.picture,
                    picture.name
                )
            );
        }
    }

    // Data getters
    /**
     * Retrieves the search results
     * @returns The results
     */
    public getPictures(): Image[] {
        return this.results.get();
    }

    /**
     * Retrieves whether there was a search error
     * @returns The error if present
     */
    public getError(): string {
        return this.searchError.get();
    }

    /**
     * Retrieves whether the search is being performed
     * @returns Whether we are loading
     */
    public isLoading(): boolean {
        return this.loading.get();
    }

    // Search management
    /**
     * Sets the current search text instantly
     * @param search The search text
     */
    public setSearch(search: string): void {
        this.search.set(search);
    }

    /**
     * Retrieves the current search text
     * @returns The search text
     */
    public getSearch(): string {
        return this.search.get();
    }

    /**
     * Performs the search
     * @returns A promise that resolves when the search finishes
     */
    public async performSearch(): Promise<void> {
        const search = this.search.get();
        this.searchError.set(null);
        if (search.length == 0) {
            this.results.set([]);
            return;
        }
        this.loading.set(true);

        // Get some images from an api
        const params = new URLSearchParams(Object.entries({
            name: search,
        }) as any);
        const response = await fetch(
            "https://cors-anywhere.herokuapp.com/https://rickandmortyapi.com/api/character/?" +
                params
        );
        // Or https://jereze.com/code/image-search-api/
        const data = await response.json();
        if (data.error == "There is nothing here") {
            this.searchError.set(`No characters by the name "${search}" could be found`);
            return;
        }
        if (!data.results) {
            this.searchError.set("Something went wrong while performing the search");
            return;
        }

        // Map the result to our format
        const images = data.results.map(item => ({
            name: item.name,
            picture: item.image,
        }));

        this.results.set(images);
        this.loading.set(false);
    }
}
