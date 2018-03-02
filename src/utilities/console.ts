import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IExceptionHandler } from "../Interfaces/IExceptionHandler";
import { ExceptionEnum, DialogException } from "../Interfaces/Misc";

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
    handle(exception: DialogException): void {
        switch (exception.exception) {
            case ExceptionEnum.IntentNotFoundException:
            case ExceptionEnum.InvalidActionNameException:
            case ExceptionEnum.InvalidStateFormatException:
            case ExceptionEnum.UnknownActionTypeException:
            case ExceptionEnum.UnknownException:
            case ExceptionEnum.StateNotFoundException:
            case ExceptionEnum.TimeoutValueIsNotANumberException:
            case ExceptionEnum.StateExpirationCurruptedException:
                console.log(ExceptionEnum[exception.exception], exception.value);
                break;
            default:
                console.log("Something wierd happend D:");
                console.log(exception);
        }
    }
}
