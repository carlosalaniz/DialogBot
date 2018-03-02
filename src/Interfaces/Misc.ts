
export interface IOutType<T> {
    out: T
}

export enum ExceptionEnum {
    IntentNotFoundException,
    StateNotFoundException,
    InvalidActionNameException,
    UnknownActionException,
    InvalidStateFormatException,
    UnknownException,
    TimeoutValueIsNotANumberException,

}

export interface UserState {
    intent?: string,
    state?: string,
    payload?: any,
    expires_at?: any
}
