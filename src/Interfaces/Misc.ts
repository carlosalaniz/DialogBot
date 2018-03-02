
export interface IOutType<T> {
    out: T
}

export class DialogException {
    public value: any;
    public exception: ExceptionEnum;
    public constructor(exception: ExceptionEnum, value: any) {
        this.exception = exception;
        this.value = value;
    }
}

export enum ExceptionEnum {
    IntentNotFoundException,
    StateNotFoundException,
    InvalidActionNameException,
    UnknownActionTypeException,
    InvalidStateFormatException,
    UnknownException,
    TimeoutValueIsNotANumberException,
    StateExpirationCurruptedException
}

export interface UserState {
    intent?: string,
    state?: string,
    payload?: any,
    expires_at?: any
}
