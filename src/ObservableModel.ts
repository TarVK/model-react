import {BaseModel} from "./Model";
import {Field} from "./Field";

/**
 * An obersvable class proxy for a model, such that we can track what location a call was made from (by assigning a unique proxy to each component) and call onUpdate when any of the used fields change
 */
export abstract class ObservableModel {
    // The model to proxy
    private model: BaseModel;

    // All of the fields that have been used to obtain data from, which are now listened to in order to call the onUpdate function
    private usedFields: Field<any>[] = [];

    // The function to call whenever any of the fields we got data from updated their data
    private onUpdate: (fields: Field<any>[]) => void;

    // Whether or not to reset the used fields on update
    private resetOnUpdate: boolean;

    /**
     * Creates a new observable model proxy for the given model
     * @param model The model to proxy
     * @param onUpdate The function to call when any of the used fields change
     * @param resetOnUpdate Whether to reset the used fields when an update is triggered
     */
    constructor(
        model: BaseModel,
        onUpdate: (fields: Field<any>[]) => void,
        resetOnUpdate: boolean = true
    ) {
        this.model = model;
        this.onUpdate = onUpdate;
        this.resetOnUpdate = resetOnUpdate;
    }

    /**
     * Checks whether two models equal each other, useful for when one of them is an observable model
     * @param model The model to test equivalence with
     * @boolean Whether the models are equivalent
     */
    public $equals(model: any): boolean {
        return this.model.$equals(model);
    }

    /**
     * Disposes of the observable model, ensuring onUpdate won't be called anymore
     */
    public $destroy(): void {
        this.$removeListeners();
    }

    /**
     * Listens to fields being used by this model proxy,
     * Registers $update as a listener of the used field
     */
    protected $getListener = (field: Field<any>) => {
        field.addListener(this.$update);
        if (this.usedFields.indexOf(field) == -1) this.usedFields.push(field);
    };

    /**
     * Is called by a used field when its data changes,
     * Calls onUpdate and resets used fields if instructed to
     */
    protected $update = () => {
        const fields = this.usedFields;
        if (this.resetOnUpdate) this.$removeListeners();
        this.onUpdate(fields);
    };

    /**
     * Removes all listeners from the fields, and resets the used fields
     */
    protected $removeListeners(): void {
        this.usedFields.forEach(field => {
            field.removeListener(this.$update);
        });
        this.usedFields = [];
    }

    // Static methods
    /**
     * Creates an observable model class for a given model class
     * @param modelClass The model class to create an observable version for
     * @returns The created model class
     */
    static createObservableModelClass(modelClass) {
        // Create a name class
        const cls = new Function(
            "cls",
            `return class Observable${modelClass.name} extends cls {}`
        )(ObservableModel);

        // Go through all of the methods of the class to create proxy methods for them
        let Class = modelClass;
        while (Class && Class.prototype) {
            // Go through all
            Object.keys(Class.prototype).forEach(key => {
                // Obtain the value associated with the key
                const value = Class.prototype[key];

                // Check if this value is a function we want to proxy, and create a proxy if so
                if (key != "constructor" && value instanceof Function) {
                    cls.prototype[key] = function() {
                        // Update the get listener
                        const oldGetListener = this.model.$getListener;
                        this.model.$getListener = this.$getListener;

                        // Actuall call the method
                        const result = value.apply(this.model, arguments);

                        // Reset the get lisetener
                        this.model.$getListener = oldGetListener;

                        // Return the result
                        return result;
                    };
                }
            });

            // Repeat for any super class
            Class = (Class as any).__proto__;
        }

        // Return the created class
        return cls;
    }
}

/**
 * A way to declare we have an observable instance of a model
 */
export type Observable<T extends BaseModel> = T & ObservableModel;
