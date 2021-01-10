import React, {FC} from "react";
import {
    DataLoader,
    LoadableField,
    IDataHook,
    ExecutionState,
    Loader,
    useDataHook,
    getAsync,
} from "model-react";

/**********************
 *    Fake backend    *
 **********************/
type IGender = "male" | "female" | "other";
type IUserData = {
    firstName: string;
    lastName: string;
    age: number;
    gender: IGender;
};
const initUsers = [
    {
        firstName: "John",
        lastName: "Johnson",
        age: 35,
        gender: "male" as IGender,
    },
    {
        firstName: "Bob",
        lastName: "Bobson",
        age: 53,
        gender: "female" as IGender,
    },
];
const notFoundUser: IUserData = {
    firstName: "not found",
    lastName: "not found",
    age: 0,
    gender: "female",
};

class Backend {
    protected data = new Map<number, IUserData>([[1, initUsers[0]]]);
    public async fetch(id: number): Promise<IUserData> {
        await new Promise(res => setTimeout(res, 1000));
        return this.data.get(id) || notFoundUser;
    }
    public async put(id: number, user: IUserData): Promise<void> {
        await new Promise(res => setTimeout(res, 1000));
        this.data.set(id, user);
        console.log(this.data);
    }

    protected index = 0;
    public fakeExternalUpdate(): void {
        this.put(1, initUsers[++this.index % 2]);
    }
}
const backend = new Backend();

/**********************
 *      Frontend      *
 **********************/
class User {
    protected data = new DataLoader(
        () =>
            // Fake fetch request
            backend.fetch(this.ID),
        notFoundUser
    );
    protected saving = new ExecutionState();

    public constructor(protected ID: number) {}

    public firstName = new LoadableField(h => this.data.get(h).firstName);
    public lastName = new LoadableField(h => this.data.get(h).lastName);
    public age = new LoadableField(h => this.data.get(h).age);
    public gender = new LoadableField(h => this.data.get(h).gender);

    public isDirty(h?: IDataHook): boolean {
        return [this.firstName, this.lastName, this.age, this.gender].reduce(
            (isDirty, field) => isDirty || field.isDirty(h),
            false
        );
    }
    public isSaving(h?: IDataHook): boolean {
        return this.saving.get(h);
    }
    public save(): Promise<void> {
        return this.saving.add(async () => {
            // Fake post request
            await backend.put(this.ID, {
                firstName: this.firstName.get(),
                lastName: this.lastName.get(),
                age: this.age.get(),
                gender: this.gender.get(),
            });
            this.reload();
            await getAsync(h => this.data.get(h));
        });
    }
    public reload(): void {
        this.data.markDirty();
    }
}

// Create a input components
const SomeTextInput: FC<{field: LoadableField<string>}> = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <input
                type="text"
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeNumberInput: FC<{field: LoadableField<number>}> = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <input
                type="number"
                value={field.get(h)}
                onChange={e => field.set(Number(e.target.value))}
            />
        )}
    </Loader>
);
const SomeGenderInput: FC<{field: LoadableField<IGender>}> = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <select
                value={field.get(h)}
                onChange={e => field.set(e.target.value as IGender)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        )}
    </Loader>
);

// User component
const UserView: FC<{user: User}> = ({user}) => {
    const [h] = useDataHook();
    return (
        <>
            First name: <SomeTextInput field={user.firstName} />
            <br />
            Last name: <SomeTextInput field={user.lastName} />
            <br />
            Age: <SomeNumberInput field={user.age} />
            <br />
            Gender: <SomeGenderInput field={user.gender} />
            <br />
            <button onClick={() => user.reload()}>Reload</button>{" "}
            <Loader onLoad={"Saving"}>
                {savingHook =>
                    !user.isSaving(savingHook) && (
                        <button disabled={!user.isDirty(h)} onClick={() => user.save()}>
                            Save
                        </button>
                    )
                }
            </Loader>
        </>
    );
};

// Render some app to alter a user
const user = new User(1);
export default (
    <div>
        <UserView user={user} />
        <br />
        <br />
        <button onClick={() => backend.fakeExternalUpdate()}>Change remote data</button>
    </div>
);
