import { BaseModel } from "./Model";
import { Context } from "react";
/**
 * Uses a model, and automatically rerenders the component when used data of the model changes
 * @param model The model to use, or a context containing the model to use
 */
export declare function useModel<T extends BaseModel>(model: T | Context<T>): T;
