import { Field, useDataHook, IDataRetrieverParams } from "model-react";
import React, { FC } from "react";

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
  public getName(p: IDataRetrieverParams): string {
    return this.name.get(p);
  }
  public setAge(age: number): void {
    this.age.set(age);
  }
  public getAge(p: IDataRetrieverParams): number {
    return this.age.get(p);
  }
}

const PersonEditor: FC<{ person: Person }> = ({ person }) => {
  const [l] = useDataHook();
  return (
    <div>
      <input
        value={person.getName(l)}
        onChange={e => person.setName(e.target.value)}
      />
      <input
        type="number"
        value={person.getAge(l)}
        onChange={e => person.setAge(Number(e.target.value))}
      />
    </div>
  );
};

const PersonProfile: FC<{ person: Person }> = ({ person }) => {
  const [l] = useDataHook();
  return (
    <div>
      Name: {person.getName(l)} <br />
      Age: {person.getAge(l)}
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
