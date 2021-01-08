import React, {FC} from "react";
import {Field, useDataHook, IDataRetriever} from "model-react";

// Create some standard components
const SomeInput: FC<{field: Field<string>}> = ({field}) => {
    const [h] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(h)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput: FC<{dataRetriever: IDataRetriever<string>}> = ({dataRetriever}) => {
    const [h] = useDataHook();
    return <div>{dataRetriever(h)}</div>;
};

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'virtual data source' that combines or transforms source data
const virtualSource: IDataRetriever<string> = h => `${field1.get(h)} - ${field2.get(h)}`;

// Render some 'app' element that shows the two fields and combined output
export default (
    <div>
        <SomeInput field={field1} />
        <SomeInput field={field2} />
        <SomeOutput dataRetriever={virtualSource} />
    </div>
);
