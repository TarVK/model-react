import { BaseModel } from "./Model";
import { Field } from "./Field";
/**
 * An obersvable class proxy for a model, such that we can track what location a call was made from (by assigning a unique proxy to each component) and call onUpdate when any of the used fields change
 */
export declare abstract class ObservableModel {
    private model;
    private usedFields;
    private onUpdate;
    private resetOnUpdate;
    /**
     * Creates a new observable model proxy for the given model
     * @param model The model to proxy
     * @param onUpdate The function to call when any of the used fields change
     * @param resetOnUpdate Whether to reset the used fields when an update is triggered
     */
    constructor(model: BaseModel, onUpdate: (fields: Field<any>[]) => void, resetOnUpdate?: boolean);
    /**
     * Checks whether two models equal each other, useful for when one of them is an observable model
     * @param model The model to test equivalence with
     * @boolean Whether the models are equivalent
     */
    $equals(model: any): boolean;
    /**
     * Disposes of the observable model, ensuring onUpdate won't be called anymore
     */
    $destroy(): void;
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
     * Removes all listeners from the fields, and resets the used fields
     */
    protected $removeListeners(): void;
    /**
     * Creates an observable model class for a given model class
     * @param modelClass The model class to create an observable version for
     * @returns The created model class
     */
    static createObservableModelClass(modelClass: any): any;
}
/**
 * A way to declare we have an observable instance of a model
 */
export declare type Observable<T extends BaseModel> = T & ObservableModel;
