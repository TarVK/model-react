import {Field, IDataHook} from "model-react";

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
     * @param h The data hook
     * @returns The user's name
     */
    public getName(h?: IDataHook): string {
        return this.name.get(h);
    }
}
