import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
import { IUseDataHookConfig } from "../_types/IUseDataHookConfig";
import { IUseDataHookState } from "../_types/IUseDataHookState";
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param options  Configuration options
 * @returns The data hook followed by contextual data
 */
export declare const useDataHook: ({ forceRefreshTime, debounce, onChange, }?: IUseDataHookConfig) => [IDataListener & IDataLoadRequest, IUseDataHookState];
//# sourceMappingURL=useDataHook.d.ts.map