import { timeout } from "q";

export enum ReservedStateNamesEnum {
    startAt = "startAt"
}
export enum FixedStateNamesEnum {
    timeout = "timeout"
}

export enum ActionEnum {
    sendMessage = 'send-message',
    confirm = 'confirm',
    collectInput = "collect-input",
    sendExternal = "send-external"
}

export interface ISendExternalState extends IState {
    uri: string,
    method: string
}

export interface ISendMessageState extends IState {
    field_key?: string,
    message: IMessage
}

export interface IConfirmationState extends IState {
    confirm_next: string,
    reject_next: string,
    default_next: string,
    unknown_next?: string,
}

export interface ICollectInputState extends IState {
    field: string
}

export interface IState {
    action: ActionEnum,
    next?: string,
    wait?: boolean
    timeout?: number,
}

export interface IMessage {
    text: string[][],
    quickreply?: any
}

export interface IIntent {
    startAt: string,
    timeout?: string,
    [StateKey: string]:
    ISendMessageState |
    IConfirmationState |
    ICollectInputState |
    ISendExternalState | string | undefined
}
