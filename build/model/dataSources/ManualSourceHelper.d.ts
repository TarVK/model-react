import { IDataListener } from "../_types/IDataListener";
/**
 * A class to help with creating advanced manual data sources
 */
export declare class ManualSourceHelper {
    protected listeners: IDataListener[];
    protected exceptions: readonly any[];
    protected loading: boolean;
    protected onLoadRequest?: (time?: number) => void;
    /**
     * Creates a new manual source helper
     * @param onLoadRequest The callback to make when a hook requests a data (re)load
     */
    constructor(onLoadRequest?: (time?: number) => void);
    /**
     * Sets any exceptions that may have occurred in the source
     * @param exceptions The exceptions to pass to listeners
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setExceptions(exceptions: any[] | readonly any[], suppressUpdate?: boolean): void;
    /**
     * Retrieves the exceptions that the source currently indicate to have
     * @returns The exceptions
     */
    getExceptions(): readonly any[];
    /**
     * Sets whether this source is loading
     * @param loading Whether the source is loading
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setLoading(loading: boolean, suppressUpdate?: boolean): void;
    /**
     * Retrieves whether the source currently indicates to be loading
     * @returns Whether the source indicates to be loading
     */
    getLoading(): boolean;
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    addListener(listener?: any): void;
    /**
     * Signals all listeners that data has been altered
     */
    callListeners(): void;
}
//# sourceMappingURL=ManualSourceHelper.d.ts.map