import {BaseModel, Field} from "model-react";

export class TestModel extends BaseModel {
    protected number = new Field(5);
    protected string = new Field("potatoes");

    public getString(): string {
        return this.string.get();
    }
    public getNumberString(): string {
        return `${this.string.get()} ${this.number.get()}`;
    }
    public getNumber(): number {
        return this.number.get();
    }
    private getSmth(): number {
        return this.number.get() + 12;
    }

    public setNumber(value: number): void {
        this.number.set(value);
    }
    public setString(value: string): void {
        this.string.set(value);
    }
}
