import {ObservableModel, Observable} from "./ObservableModel";
import {Field} from "./Field";
import uuidv4 from "uuid/v4";

/**
 * The base class to create a custom model from
 */
export abstract class BaseModel {
    // A listener function that listens for values of fields of this model being retrieved
    protected $getListener: (field: Field<any>) => void = () => {};

    // The ID of the model instance
    protected $ID: string = uuidv4();

    /**
     * Creates an instance of the model
     */
    constructor() {
        Field.setModel(this);
    }

    /**
     * Retrieves a unique ID for this model instance
     * @returns A UUID for this model instance
     */
    public $getID(): string {
        return this.$ID;
    }

    /**
     * Checks whether two models equal each other, useful for when one of them is an observable model
     * @param model The model to test equivalence with
     * @boolean Whether the models are equivalent
     */
    public $equals(model: BaseModel | ObservableModel): boolean {
        return (model as any).$getID() == this.$getID();
    }

    /**
     * Creates an observable proxy for this model instance
     * @param onUpdate The function to call when any of the used fields change
     * @param resetOnUpdate Whether to reset the used fields when an update is triggered
     * @returns The proxy
     */
    public $getObservableModel(
        onUpdate: () => void,
        resetOnUpdate: boolean = false
    ): Observable<this> {
        // Obtain the class of this model object
        const Class: typeof BaseModel = this.constructor as any;

        // Obtain the proxy class for this model class
        const ModelClass = Class.createObservableModelClass();

        // Create an instance of the proxy
        return new ModelClass(this, onUpdate, resetOnUpdate);
    }

    /**
     * Binds a model t, such that when our model uses its data in a getter, our model will inform components when relevant pieces of t are updated
     * @param model The model to bind
     * @returns The bound observable model
     */
    protected $bindModel<T extends BaseModel>(model: T): Observable<T> {
        const observableModel = model.$getObservableModel(() => {});
        // Make sure that whenever a value from a field is used on the bound model,
        // We instead inform our listener of usage
        const This = this;
        (observableModel as any).$getListener = function() {
            This.$getListener.apply(This, arguments);
        };

        // Return the model
        return observableModel;
    }

    // Static methods
    /**
     * The observable model class created for this model (A model extending the BaseModel)
     * This class will have the same methods as the actual model.
     * Upon calling any of these methods, it will swappout the $getListener for it's own on the actual model before forwarding the method call to the model and swap the original $getListener after the call.
     */
    private static observableModelClass;

    /**
     * Creates an observable model class for this model class
     * @returns The observable model class
     */
    public static createObservableModelClass() {
        // Create the model class if not present
        if (!this.observableModelClass)
            this.observableModelClass = ObservableModel.createObservableModelClass(this);

        // Return the observable model class
        return this.observableModelClass;
    }
}
