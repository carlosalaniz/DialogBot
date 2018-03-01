import { IIntent } from "./StateDefinitions";

export interface IConvoMap {
    [IntentKey: string]: IIntent | undefined;
}
