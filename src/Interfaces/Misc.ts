
interface IOutType<T> {
    out: T
}

enum ExceptionEnum {
    IntentNotFoundException,
    InvalidActionNameException,
    UnknownActionException,
    InvalidStateFormatException,
    UnknownException
}

interface UserState {
    intent?: string,
    state?: string,
    payload?: any,
    waiting?: boolean
}