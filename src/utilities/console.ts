import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IExceptionHandler } from "../Interfaces/IExceptionHandler";
import { ExceptionEnum } from "../Interfaces/Misc";

export class ConsoleMessageHandler implements IMessageHandler {
    async trySendHttpDataAsync(data: any, method: string, uri: string, configurations?: any) {
        console.log("FAKE Sending ", JSON.stringify(data), " to ", uri, " through ", method)
        console.log("Sent");
    }
    async trySendMessageAsync(message: string) {
        console.log(message);
    }
    async trySendMessagesAsync(message: string[]) {
        message.forEach(async m => {
            await this.trySendMessageAsync(m);
        })
    }
}
export class ConsoleExceptionHandler implements IExceptionHandler {
    handle(exception: any): void {
        switch (exception) {
            case ExceptionEnum.IntentNotFoundException:
            case ExceptionEnum.InvalidActionNameException:
            case ExceptionEnum.InvalidStateFormatException:
            case ExceptionEnum.UnknownActionException:
            case ExceptionEnum.UnknownException:
            case ExceptionEnum.StateNotFoundException:
                console.log(ExceptionEnum[exception]);
                break;
            default:
                console.log("Something wierd happend D:");
                console.log(exception);
        }
    }
}
