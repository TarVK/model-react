var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractDataSource } from "./AbstractDataSource";
import { isDataLoadRequest } from "../_types/IDataLoadRequest";
import { handleHookError } from "../../tools/hookErrorHandler";
/**
 * A data source that can be used to convert an asynchronous loader into a synchronous data retriever with loading state
 */
export class DataLoader extends AbstractDataSource {
    /**
     * Creates a new data loader instance, used to create a data source for async data getters
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    constructor(loader, initial, dirty = true, loadImmediately = false) {
        super();
        // The timestamp at which the loader was last called
        this.lastLoadTime = 0;
        // Whether the loader is currently loading data
        this.loading = false;
        this.loader = loader;
        this.data = initial;
        this.dirty = dirty;
        if (loadImmediately)
            this.load();
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook) {
        super.addListener(hook);
        // Handle any load request
        if (isDataLoadRequest(hook))
            this.handleDataLoadRequest(hook);
        // Return the current data
        return this.data;
    }
    /**
     * Handles a data load request
     * @param request The request to handle
     */
    handleDataLoadRequest(request) {
        // Check whether we should refresh the data
        const shouldRefresh = this.dirty ||
            (request.refreshTimestamp && request.refreshTimestamp > this.lastLoadTime);
        if (shouldRefresh && request.refreshData)
            this.load();
        if (this.loading && request.markIsLoading)
            try {
                request.markIsLoading();
            }
            catch (e) {
                handleHookError(e, this, request, "markIsLoading");
            }
        // Forward exceptions
        if (this.exception && request.registerException)
            try {
                request.registerException(this.exception);
            }
            catch (e) {
                handleHookError(e, this, request, "registerException");
            }
    }
    /**
     * Fetches the data from the api
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loading) {
                // Update loading indicators
                this.loading = true;
                this.lastLoadTime = Date.now();
                // Call listeners so they know we're loading
                this.callListeners();
                // Load the new data
                try {
                    this.data = yield this.loader();
                    this.exception = undefined;
                }
                catch (e) {
                    this.exception = e;
                }
                // Update indicators
                this.loading = false;
                this.dirty = false;
                // Call listeners to they know we're done loading
                this.callListeners();
            }
        });
    }
    /**
     * Indicates that this data is no longer up to data and should be reloaded
     */
    markDirty() {
        this.dirty = true;
        this.callListeners();
    }
}
//# sourceMappingURL=DataLoader.js.map