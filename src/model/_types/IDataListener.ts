/**
 * The listener object to listen to data source changes
 */
export type IDataListener = {
  /**
   * The method to call when the source data changes
   */
  call: () => void;
  /**
   * A method to register a function to be called in order to remove this listener from a data source
   * @param remove The function to casll in order to unregister this listener
   */
  registerRemover: (remove: () => void) => void;
};
export const isDataListener = (data: any): data is IDataListener =>
  data && data.call !== undefined && data.registerRemover instanceof Function;
