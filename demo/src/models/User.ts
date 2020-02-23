import {Field, IDataRetrieverParams} from "model-react";

export class User {
    // The name of the user
    protected name = new Field("John");

    /**
     * Sets the name of the user
     * @param name The user's name
     */
    public setName(name: string): void {
        this.name.set(name);
    }

    /**
     * Retrieves the name of the user
     * @param p The retrieval parameters for the data
     * @returns The user's name
     */
    public getName(p?: IDataRetrieverParams): string {
        return this.name.get(p);
    }
}
