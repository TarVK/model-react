import {BaseModel} from "./Model";
import {useState, useMemo, Context, useContext, useEffect} from "react";

/**
 * Checks whether the given value is a react context
 * @param value The value to check
 */
function isContext<T>(value): value is Context<T> {
    return value && "Provider" in value;
}

/**
 * Uses a model, and automatically rerenders the component when used data of the model changes
 * @param model The model to use, or a context containing the model to use
 */
export function useModel<T extends BaseModel>(model: T | Context<T>): T {
    if (isContext<T>(model)) model = useContext(model);

    // Define a rerender method
    const [, setState] = useState();
    const rerender = () => setState({});

    // Create a proxy that rerenders on update and cache it
    const modelProxy = useMemo(
        () => model && (model as T).$getObservableModel(rerender),
        [model]
    );

    // Make sure to dispose the model when the component is unmounted (such that no more rerenders are triggered)
    useEffect(
        () => () => {
            modelProxy && modelProxy.$destroy();
        },
        []
    );

    // Return the model
    return modelProxy;
}
