import React from "react";
import {
    DataLoader,
    LoadableField,
    ExecutionState,
    Loader,
    useDataHook,
    getAsync,
} from "model-react";

/**********************
 *    Fake backend    *
 **********************/
const initUsers = [
    {
        firstName: "John",
        lastName: "Johnson",
        age: 35,
        gender: "male",
    },
    {
        firstName: "Bob",
        lastName: "Bobson",
        age: 53,
        gender: "female",
    },
];
const notFoundUser = {
    firstName: "not found",
    lastName: "not found",
    age: 0,
    gender: "female",
};

class Backend {
    data = new Map([[1, initUsers[0]]]);
    async fetch(id) {
        await new Promise(res => setTimeout(res, 1000));
        return this.data.get(id) || notFoundUser;
    }
    async put(id, user) {
        await new Promise(res => setTimeout(res, 1000));
        this.data.set(id, user);
        console.log(this.data);
    }

    index = 0;
    fakeExternalUpdate() {
        this.put(1, initUsers[++this.index % 2]);
    }
}
const backend = new Backend();

/**********************
 *      Frontend      *
 **********************/
class User {
    data = new DataLoader(
        () =>
            // Fake fetch request
            backend.fetch(this.ID),
        notFoundUser
    );
    saving = new ExecutionState();

    constructor(ID) {
        this.ID = ID;
    }

    firstName = new LoadableField(h => this.data.get(h).firstName);
    lastName = new LoadableField(h => this.data.get(h).lastName);
    age = new LoadableField(h => this.data.get(h).age);
    gender = new LoadableField(h => this.data.get(h).gender);

    isDirty(h) {
        return [this.firstName, this.lastName, this.age, this.gender].reduce(
            (isDirty, field) => isDirty || field.isDirty(h),
            false
        );
    }
    isSaving(h) {
        return this.saving.get(h);
    }
    save() {
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
    reload() {
        this.data.markDirty();
    }
}

// Create a input components
const SomeTextInput = ({field}) => (
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
const SomeNumberInput = ({field}) => (
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
const SomeGenderInput = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <select
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        )}
    </Loader>
);

// User component
const UserView = ({user}) => {
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
