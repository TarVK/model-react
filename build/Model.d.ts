import { ObservableModel, Observable } from "./ObservableModel";
import { Field } from "./Field";
/**
 * The base class to create a custom model from
 */
export declare abstract class BaseModel {
    protected $getListener: (field: Field<any>) => void;
    protected $ID: string;
    /**
     * Creates an instance of the model
     */
    constructor();
    /**
     * Retrieves a unique ID for this model instance
     * @returns A UUID for this model instance
     */
    $getID(): string;
    /**
     * Checks whether two models equal each other, useful for when one of them is an observable model
     * @param model The model to test equivalence with
     * @boolean Whether the models are equivalent
     */
    $equals(model: BaseModel | ObservableModel): boolean;
    /**
     * Creates an observable proxy for this model instance
     * @param onUpdate The function to call when any of the used fields change
     * @param resetOnUpdate Whether to reset the used fields when an update is triggered
     * @returns The proxy
     */
    $getObservableModel(onUpdate: () => void, resetOnUpdate?: boolean): Observable<this>;
    /**
     * Binds a model t, such that when our model uses its data in a getter, our model will inform components when relevant pieces of t are updated
     * @param model The model to bind
     * @returns The bound observable model
     */
    protected $bindModel<T extends BaseModel>(model: T): Observable<T>;
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
    static createObservableModelClass(): any;
}
