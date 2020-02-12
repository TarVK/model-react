import {Picture} from "./Picture";
import {application} from "./application";
import {Field, IDataRetrieverParams, DataLoader} from "model-react";

type Image = {picture: string; name: string};
export class PictureSearch {
    // The text currently being searched for
    protected search = new Field("");

    // The search results
    protected results = new DataLoader<Image[]>(
        async () => {
            const search = this.search.get();
            if (!search) return [];

            // Get some images from an api
            const params = new URLSearchParams(
                Object.entries({
                    name: search,
                }) as any
            );
            const response = await fetch(
                "https://cors-anywhere.herokuapp.com/https://rickandmortyapi.com/api/character/?" +
                    params
            );
            // Or https://jereze.com/code/image-search-api/
            const data = await response.json();
            if (data.error == "There is nothing here")
                throw `No characters by the name "${search}" could be found`;
            if (!data.results) throw "Something went wrong while performing the search";

            // Map the result to our format
            return data.results.map(item => ({
                name: item.name,
                picture: item.image,
            }));
        },
        [],
        false
    );

    // The picture that we want to change
    protected pictureToChange: Picture;

    // Picture assignment
    /**
     * Set the picture to update
     * @param Picture The target picture
     */
    public setTarget(picture: Picture): void {
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
            application.addPicture(
                new Picture(application.getUser(), picture.picture, picture.name)
            );
        }
    }

    // Data getters
    /**
     * Retrieves the search results
     * @param p The retrieval parameters for the data
     * @returns The results
     */
    public getPictures(p?: IDataRetrieverParams): Image[] {
        return this.results.get(p);
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
     * @param p The retrieval parameters for the data
     * @returns The search text
     */
    public getSearch(p?: IDataRetrieverParams): string {
        return this.search.get(p);
    }

    /**
     * Performs the search
     */
    public performSearch(): void {
        // Forces data to be refetched
        this.results.markDirty();
    }
}
