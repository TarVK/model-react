import {DataCacher, Field, IDataHook, IDataRetriever, Loader} from "model-react";
import React, {FC} from "react";

// The original data provided by some api potentially out of your control
class Name extends Field<string> {
    public constructor(public ID: number) {
        super("");
    }
}
const names = new Field([] as Name[]);

const NameEditor: FC<{names: Field<Name[]>}> = ({names}) => (
    <div>
        <button onClick={() => names.set([...names.get(), new Name(Math.random())])}>
            Add name
        </button>
        <Loader>
            {h =>
                names.get(h).map(name => (
                    <div key={name.ID}>
                        <input
                            type="text"
                            value={name.get(h)}
                            onChange={e => name.set(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                const current = names.get();
                                const index = current.indexOf(name);
                                if (index != -1)
                                    names.set([
                                        ...current.slice(0, index),
                                        ...current.slice(index + 1),
                                    ]);
                            }}>
                            Remove
                        </button>
                    </div>
                ))
            }
        </Loader>
    </div>
);

// Some additional data that someone might want to add separately from the original data
type IRole = "first name" | "last name";
const someExpensiveTransformation = (data: string) => data.split("").reverse().join("");
class NameData {
    protected role = new Field("first name" as IRole);
    protected reversedName = new DataCacher(h =>
        someExpensiveTransformation(this.name.get(h))
    );
    public constructor(public name: Name) {}

    public getRole(h?: IDataHook): IRole {
        return this.role.get(h);
    }
    public setRole(role: IRole): void {
        this.role.set(role);
    }
    public getReversedName(h?: IDataHook): string {
        return this.reversedName.get(h);
    }
}

const namesData = new DataCacher<{list: NameData[]; map: Map<number, NameData>}>(
    (h, prev) => {
        // Use the names data source as the ground truth, and add consistent custom data to it
        const current = names.get(h);
        const map = new Map(prev?.map ?? []);
        const list = current.map(name => {
            let nameData = map.get(name.ID);
            if (!nameData) {
                nameData = new NameData(name);
                map.set(name.ID, nameData);
            }
            return nameData;
        });
        return {list, map};
    }
);

const NameDataEditor: FC<{getNamesData: IDataRetriever<NameData[]>}> = ({
    getNamesData,
}) => (
    <Loader>
        {h =>
            getNamesData(h).map(data => (
                <div key={data.name.ID}>
                    <input
                        type="text"
                        value={data.name.get(h)}
                        onChange={e => data.name.set(e.target.value)}
                    />{" "}
                    {data.getReversedName(h)}{" "}
                    <select
                        value={data.getRole(h)}
                        onChange={e => data.setRole(e.target.value as IRole)}>
                        <option value="first name">First name</option>
                        <option value="last name">Last name</option>
                    </select>
                </div>
            ))
        }
    </Loader>
);

// Render the app
export default (
    <div>
        Original data:
        <NameEditor names={names} />
        <br />
        Augmented data:
        <NameDataEditor getNamesData={h => namesData.get(h).list} />
    </div>
);
