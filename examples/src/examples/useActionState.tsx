import React, {FC} from "react";
import {useDataHook, useActionState, LoaderSwitch, Loader} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// A fake async action
const doSomething = async (error?: boolean) => {
    await delay();
    if (error) throw "Error";
    return Math.random();
};

// Create some component that uses doSomething
const Something: FC<{error?: boolean}> = ({error}) => {
    const [l, c] = useDataHook();
    const [addAction, reset, result] = useActionState<number>(l);
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
const SomethingInline: FC = () => (
    <Loader onLoad={"Loading"} onError={err => `Errored: ${err}`}>
        {l => {
            const [addAction, reset, result] = useActionState<number>(l);
            return (
                <>
                    <button onClick={() => addAction(doSomething())}>
                        perform action
                    </button>
                    The result is: {result}
                </>
            );
        }}
    </Loader>
);

// Two elements to show that data is not synchronized (ActionState in class form can be used for this)
export default (
    <div>
        <Something />
        <br />
        <Something error />
        <br />
        <SomethingInline />
    </div>
);
