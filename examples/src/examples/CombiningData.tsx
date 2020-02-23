import React, {FC} from "react";
import {Field, useDataHook, IDataRetriever} from "model-react";

const SomeInput: FC<{field: Field<string>}> = ({field}) => {
    const [l] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(l)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput: FC<{dataRetriever: IDataRetriever<string>}> = ({dataRetriever}) => {
    const [l] = useDataHook();
    return <div>{dataRetriever(l)}</div>;
};

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'transformer' that combines or transforms source data
const transformer: IDataRetriever<string> = l => `${field1.get(l)} - ${field2.get(l)}`;

// Render some 'app' element that shows the two fields and combined output
export default (
    <div>
        <SomeInput field={field1} />
        <SomeInput field={field2} />
        <SomeOutput dataRetriever={transformer} />
    </div>
);
