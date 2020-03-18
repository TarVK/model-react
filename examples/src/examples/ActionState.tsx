import React, {FC, ReactNode} from "react";
import {useDataHook, ActionState, IDataRetrieverParams, LoaderSwitch} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Action state sources only really make sense in combination with some async action functions
class Something {
    protected saving = new ActionState<void>();
    /**
     * Checks whether the data is saving
     * @returns Whether we are currently saving data
     */
    public isSaving(hook: IDataRetrieverParams): void {
        this.saving.get(hook);
    }

    /**
     * Performs fake save
     * @param withError Whether the fake save should mock an error
     */
    public async save(withError: boolean = false): Promise<void> {
        return await this.saving.addAction(async () => {
            // Something async in here
            await delay();
            if (withError) throw "Error";
            console.log("Saved");
        }, true); // the true resets previous actions
    }
}
const smthInstance = new Something();

// Create some element that may use the state
const SaveButton: FC<{smth: Something; error?: boolean; children: ReactNode}> = ({
    smth,
    error = false,
    children,
}) => {
    const [l, c] = useDataHook();
    smth.isSaving(l); // Pass the saving data to the hook
    return (
        <button
            onClick={() => {
                if (!c.isLoading()) smth.save(error);
            }}>
            <LoaderSwitch {...c} onLoad={"Saving"} onError={err => `Errored: ${err}`}>
                {children}
            </LoaderSwitch>
        </button>
    );
};

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SaveButton smth={smthInstance}>Save</SaveButton>
        <br />
        <SaveButton smth={smthInstance} error>
            Save with error
        </SaveButton>
    </div>
);
