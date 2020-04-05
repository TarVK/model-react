import {Field, useDataHook} from "model-react";
import React from "react";

class Person {
    constructor(name, age) {
        this.name = new Field(name);
        this.age = new Field(age);
    }
    setName(name) {
        this.name.set(name);
    }
    getName(h) {
        return this.name.get(h);
    }
    setAge(age) {
        this.age.set(age);
    }
    getAge(h) {
        return this.age.get(h);
    }
}

const PersonEditor = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            <input
                value={person.getName(h)}
                onChange={e => person.setName(e.target.value)}
            />
            <input
                type="number"
                value={person.getAge(h)}
                onChange={e => person.setAge(Number(e.target.value))}
            />
        </div>
    );
};

const PersonProfile = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            Name: {person.getName(h)} <br />
            Age: {person.getAge(h)}
        </div>
    );
};

const john = new Person("John", 1);
export default (
    <div>
        <PersonEditor person={john} />
        <PersonProfile person={john} />
    </div>
);
