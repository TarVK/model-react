import React from "react";
import {useDataHook, useActionState, LoaderSwitch, Loader} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// A fake async action
const doSomething = async error => {
    await delay();
    if (error) throw "Error";
    return Math.random();
};

// Create some component that uses doSomething
const Something = ({error}) => {
    const [h, c] = useDataHook();
    const [addAction, reset, result] = useActionState(h);
    return (
        <LoaderSwitch
            {...c}
            onLoad={"Loading"}
            onError={err => (
                <>
                    Errored: {err} <button onClick={reset}>reset</button>
                </>
            )}>
            <button onClick={() => addAction(doSomething(error))}>
                perform action {error && " with error"}
            </button>
            The result is: {result}
        </LoaderSwitch>
    );
};

// Another component that uses doSomething, but inline
const SomethingInline = () => (
    <Loader onLoad={"Loading"} onError={err => `Errored: ${err}`}>
        {h => {
            const [addAction, reset, result] = useActionState(h);
            return (
                <div>
                    <button onClick={() => addAction(doSomething())}>
                        perform action
                    </button>
                    The result is: {result}
                </div>
            );
        }}
    </Loader>
);

// Multiple elements to show that data is not synchronized (ActionState in class form can be used for this)
export default (
    <div>
        <Something />
        <br />
        <Something error />
        <br />
        <SomethingInline />
    </div>
);
