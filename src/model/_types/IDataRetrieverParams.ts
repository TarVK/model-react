import {IDataLoadRequest} from "./IDataLoadRequest";
import {IDataListener} from "./IDataListener";

/**
 * The valid parameters for a data retriever
 */
export type IDataRetrieverParams = IDataLoadRequest | IDataListener;
