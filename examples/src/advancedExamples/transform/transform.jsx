import {DataCacher, Field, Loader} from "model-react";
import React from "react";

// The original data provided by some api potentially out of your control
class Name extends Field {
    constructor(ID) {
        super("");
        this.ID = ID;
    }
}
const names = new Field([]);

const NameEditor = ({names}) => (
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
const someExpensiveTransformation = data => data.split("").reverse().join("");
class NameData {
    role = new Field("first name");
    reversedName = new DataCacher(h =>
        someExpensiveTransformation(this.name.get(h))
    );
    constructor(name) {
        this.name = name;
    }

    getRole(h) {
        return this.role.get(h);
    }
    setRole(role) {
        this.role.set(role);
    }
    getReversedName(h) {
        return this.reversedName.get(h);
    }
}

const namesData = new DataCacher(
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

const NameDataEditor = ({
    getNamesData,
}) => (
    <Loader>
        {h =>
            getNamesData(h).map(data => (
                <div key={data.name.id}>
                    <input
                        type="text"
                        value={data.name.get(h)}
                        onChange={e => data.name.set(e.target.value)}
                    />{" "}
                    {data.getReversedName(h)}{" "}
                    <select
                        value={data.getRole(h)}
                        onChange={e => data.setRole(e.target.value)}>
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
