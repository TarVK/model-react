import {IDataLoadRequest} from "./IDataLoadRequest";
import {IDataListener} from "./IDataListener";

/**
 * The valid parameters for a data retriever
 */
export type IDataHook = IStrictDataHook | null;

/**
 * A non nullable data hook
 */
export type IStrictDataHook = IDataLoadRequest | IDataListener;
