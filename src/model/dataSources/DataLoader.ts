import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import {
  IDataLoadRequest,
  isDataLoadRequest
} from "../_types/IDataLoadRequest";
import { IDataRetrieverParams } from "../_types/IDataRetriever";

export class DataLoader<T> extends AbstractDataSource<T>
  implements IDataSource<T> {
  // The currently loaded data
  protected data: T;

  // Whether the current data is obsolete
  protected dirty: boolean;
  // The timestamp at which the loader was last called
  protected lastLoadTime: number = 0;

  // The data loading function
  protected loader: () => Promise<T>;
  // Whether the loader is currently loading data
  protected loading: boolean = false;

  // Any exception that might have occured when loading data
  protected exception: any;

  /**
   * Creates a new data loader instance
   * @param loader The function to load the data with
   * @param initial The initial value of the data
   * @param dirty Whether the initial value should be overwritten when any data is request
   * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
   */
  constructor(
    loader: () => Promise<T>,
    initial: T,
    dirty: boolean = true,
    loadImmediately: boolean = false
  ) {
    super();
    this.loader = loader;
    this.data = initial;
    this.dirty = dirty;
    if (loadImmediately) this.load();
  }

  /**
   * Retrieves the data of a source
   * @param params Data used to know whether to reload and to notify about state changes
   * @returns The data that's currently available
   */
  get(params?: IDataRetrieverParams): T {
    super.addListener(params);
    // Handle any load request
    if (isDataLoadRequest(params)) this.handleDataLoadRequest(params);
    // Return the current data
    return this.data;
  }

  /**
   * Handles a data load request
   * @param request The request to handle
   */
  protected handleDataLoadRequest(request: IDataLoadRequest): void {
    // Check whether we should refresh the data
    const shouldRefresh =
      this.dirty ||
      this.loading ||
      (request.refreshTimestamp &&
        request.refreshTimestamp > this.lastLoadTime);
    if (shouldRefresh) {
      if (request.markShouldRefresh) request.markShouldRefresh();
      if (request.refreshData) this.load();
    }

    // Forward exceptions
    if (this.exception && request.registerException)
      request.registerException(this.exception);
  }

  /**
   * Fetches the data from the api
   */
  protected async load(): Promise<void> {
    if (!this.loading) {
      this.lastLoadTime = Date.now();
      this.loading = true;
      try {
        this.data = await this.loader();
        this.exception = undefined;
      } catch (e) {
        this.exception = e;
      }
      this.loading = false;
      this.dirty = false;
      this.callListeners();
    }
  }

  /**
   * Indicates that this data is no longer up to data and should be checked
   */
  public markDirty(): void {
    this.dirty = true;
    this.callListeners();
  }
}
