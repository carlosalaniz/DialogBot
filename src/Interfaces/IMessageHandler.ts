
export interface IMessageHandler {
    trySendHttpDataAsync(data: any, method: string, uri: string, configurations?: any): Promise<void>;
    trySendMessageAsync(message: string): Promise<void>;
    trySendMessagesAsync(message: string[]): Promise<void>;
}
