import {BaseModel, Field} from "model-react";

export class UserModel extends BaseModel {
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
     * @returns The user's name
     */
    public getName(): string {
        return this.name.get();
    }
}
