
export interface IMessageHandler {
    trySendHttpDataAsync(data: any, method: string, uri: string, configurations?: any): Promise<void>;
    trySendMessageAsync(message: string, quickReplies?: any): Promise<void>;
    trySendMessagesAsync(message: string[], quickReplies?: any): Promise<void>;
}
