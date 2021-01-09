import React, {FC} from "react";
import {
    IDataHook,
    IDataRetriever,
    Loader,
    ManualSourceHelper,
    useDataHook,
} from "model-react";

// Create some standard components
const SomeInput: FC<{
    getValue: (h: IDataHook) => string;
    setValue: (value: string) => void;
}> = ({getValue, setValue}) => {
    const [h] = useDataHook();
    return (
        <input type="text" value={getValue(h)} onChange={e => setValue(e.target.value)} />
    );
};
const SomeOutput: FC<{dataRetriever: IDataRetriever<string>}> = ({dataRetriever}) => (
    <Loader onLoad={<div>Changing</div>}>{h => <div>{dataRetriever(h)}</div>}</Loader>
);

// Create a custom data source using the ManualSourceHelper
let timeoutID: number;
let value: string = "hoi";
const helper = new ManualSourceHelper();
const setValue = (v: string) => {
    value = v;
    helper.callListeners();
    helper.setLoading(true);

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        helper.setLoading(false);
    }, 500) as any;
};
const getValue = (hook?: IDataHook) => {
    helper.addListener(hook);
    return value;
};

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SomeInput getValue={getValue} setValue={setValue} />
        <SomeOutput dataRetriever={getValue} />
    </div>
);
