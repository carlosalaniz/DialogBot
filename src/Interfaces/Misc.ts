
export interface IOutType<T> {
    out: T
}

export enum ExceptionEnum {
    IntentNotFoundException,
    StateNotFoundException,
    InvalidActionNameException,
    UnknownActionException,
    InvalidStateFormatException,
    UnknownException
}

export interface UserState {
    intent?: string,
    state?: string,
    payload?: any,
    waiting?: boolean
}