import {Field, useDataHook, IDataHook} from "model-react";
import React, {FC} from "react";

class Person {
    protected name = new Field("");
    protected age = new Field(0);
    public constructor(name: string, age: number) {
        this.name.set(name);
        this.age.set(age);
    }
    public setName(name: string): void {
        this.name.set(name);
    }
    public getName(h: IDataHook): string {
        return this.name.get(h);
    }
    public setAge(age: number): void {
        this.age.set(age);
    }
    public getAge(h: IDataHook): number {
        return this.age.get(h);
    }
}

const PersonEditor: FC<{person: Person}> = ({person}) => {
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

const PersonProfile: FC<{person: Person}> = ({person}) => {
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
