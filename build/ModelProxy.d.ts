import { BaseModel } from "./Model";
import { Field } from "./Field";
/**
 * A proxy for a model, such that we can track what location a call was made from (by assigning a unique proxy to each component)
 */
export declare abstract class ModelProxy {
    private model;
    private usedFields;
    private onUpdate;
    private resetOnUpdate;
    /**
     * Creates a new proxy for the given model
     * @param model The model to proxy
     * @param onUpdate The function to call when any of the used fields change
     * @param resetOnUpdate Whether to reset the used fields when an update is triggered
     */
    constructor(model: BaseModel, onUpdate: (fields: Field<any>[]) => void, resetOnUpdate?: boolean);
    /**
     * Listens to fields being used by this model proxy,
     * Registers $update as a listener of the used field
     */
    protected $getListener: (field: Field<any>) => void;
    /**
     * Is called by a used field when its data changes,
     * Calls onUpdate and resets used fields if instructed to
     */
    protected $update: () => void;
    /**
     * Creates a proxy class for a given model class
     * @param modelClass The model class to create a proxy for
     * @returns The created proxy
     */
    static createProxyClass(modelClass: any): any;
}
