export type IDataLoadRequest = {
  /**
   * Whether data should be loaded if absent or outdated
   */
  readonly refreshData?: boolean;
  /**
   * The timestamp such that data was loaded before this timestamp, it will be force reloaded
   */
  readonly refreshTimestamp?: number;
  /**
   * Marks that the retrieved data should refresh,
   * considdering the refresh timestamp passed,
   * as well a data source's own state.
   * Should only be called synchronously.
   */
  markShouldRefresh?: () => void;
  /**
   * A function to pass data retrieval exceptions to
   * @param exception An exception thrown when refreshing data
   */
  registerException?: (error: any) => void;
};
export const isDataLoadRequest = (data: any): data is IDataLoadRequest =>
  data &&
  (data.refreshData === undefined ||
    data.registerException instanceof Function ||
    data.markShouldRefresh instanceof Function);
