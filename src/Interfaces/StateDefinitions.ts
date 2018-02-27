enum ReservedStateNamesEnum {
    startAt = "startAt"
}

enum ActionEnum {
    sendMessage = 'send-message',
    confirm = 'confirm',
    collectInput = "collect-input",
    sendExternal = "send-external"
}

interface ISendExternalState extends IState {
    uri: string,
    method: string
}

interface ISendMessageState extends IState {
    field_key?: string,
    message: IMessage
}

interface IConfirmationState extends IState {
    confirm_next: string,
    reject_next: string,
    default_next: string,
    unknown_next?: string,
}

interface ICollectInputState extends IState {
    field: string
}

interface IState {
    action: ActionEnum,
    next?: string,
    wait?: boolean
}

interface IMessage {
    text: string[][],
    quickreply?: any
}

interface IIntent {
    startAt: string,
    [StateKey: string]:
    ISendMessageState |
    IConfirmationState |
    ICollectInputState |
    ISendExternalState | string | undefined
}
