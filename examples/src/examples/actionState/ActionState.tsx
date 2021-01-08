import React, {FC, ReactNode} from "react";
import {useDataHook, ActionState, IDataHook, LoaderSwitch, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Action state sources only really make sense in combination with some async action functions
class Something {
    protected saving = new ActionState<void>();
    /**
     * Checks whether the data is saving
     * @param hook The hook to add the loading state to
     * @returns Whether we are currently saving data
     */
    public isSaving(hook: IDataHook): boolean {
        this.saving.get(hook);
        return isLoading(h => this.saving.get(h));
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
    const [h, c] = useDataHook();
    smth.isSaving(h); // Pass the saving data to the hook
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

// Export some element that shows two of these save buttons, one of which causes an error
export default (
    <div>
        <SaveButton smth={smthInstance}>Save</SaveButton>
        <br />
        <SaveButton smth={smthInstance} error>
            Save with error
        </SaveButton>
    </div>
);
