import { IConvoMap } from "./Interfaces/IConversationMap";
import { UserState, IOutType, ExceptionEnum } from "./Interfaces/Misc";
import { IStorage } from "./Interfaces/IStorage";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { IExceptionHandler } from "./Interfaces/IExceptionHandler";
import { IIntent, ICollectInputState, ISendMessageState, ISendExternalState, IConfirmationState, ActionEnum, IState } from "./Interfaces/StateDefinitions";
import { searchForTokens } from "./utilities/tokenSearch";
import * as Global from "./global";
import { sprintf } from "sprintf-js"
export class Reader {
    async trySendMessageAsync(state: ISendMessageState) {
        let replaceFieldKey = state.field_key;
        let messages = state.message.text;

        let messageQuickReplies = state.message.quickreply;
        let randomMessage =
            (messages.length > 1) ? messages[Math.floor(Math.random() * messages.length)] : messages[0];
        for (let i = 0, messageText = randomMessage[i]; i < randomMessage.length;
            i++ , messageText = randomMessage[i]) {
            let payload = (this.currentState) ? this.currentState.payload : null;
            messageText = sprintf(messageText, payload);
            this.messageHandler.trySendMessageAsync(messageText)
        }
    }

    async trySendExternalAsync(state: ISendExternalState) {
        if (this.currentState == null) return;
        let data = this.currentState.payload;
        let uri = state.uri;
        let method = state.method;
        await this.messageHandler.trySendHttpDataAsync(data, method, uri);
    }

    Confirm(state: IConfirmationState, input: string) {
        //todo: change this, to evaluate multiple ways to say yes.
        if (input == 'yes') {
            state.next = state.confirm_next;
        }
        //todo: change this, to evaluate multiple ways to say no.
        else if (input == 'no') {
            state.next = state.reject_next;
        } else {
            if (state.unknown_next != null) {
                state.next = state.unknown_next;
            } else {
                state.next = state.default_next;
            }
        }
    }

    CollectInput(state: ICollectInputState, input: string) {
        if (this.currentState == null) return;
        let field = state.field;
        let data = input;
        if (this.currentState.payload == null) this.currentState.payload = {};
        this.currentState.payload[field] = data;
    }

    /**
     * 
     * @param stateKey 
     * @param intent 
     * @param stateTypeOut 
     * @throws InvalidStateFormatException, InvalidActionNameException
     */
    tryGetState(stateKey: string, intent: IIntent, stateTypeOut: IOutType<string>)
        : any | undefined {
        let intentState = intent[stateKey];
        //if state is not found return undefined
        if (intentState == null)
            throw (ExceptionEnum.StateNotFoundException)
        if (typeof intentState == 'string')
            throw (ExceptionEnum.InvalidStateFormatException)

        let state = intentState as IState;
        //check for valid state, return state and type
        switch (state.action) {
            case ActionEnum.collectInput:
            case ActionEnum.confirm:
            case ActionEnum.sendExternal:
            case ActionEnum.sendMessage:
                stateTypeOut['out'] = state.action;
                return intentState;
            default:
                throw (ExceptionEnum.InvalidActionNameException);
        }
    }

    /**
     * 
     * @param intentKey 
     * @throws IntentNotFoundException
     */
    tryGetIntent(input: string): IIntent {
        let intentKey = searchForTokens(input);
        let intent = (intentKey != null) ? this.convoMap[intentKey] : null;
        if (intent == null) {
            throw (ExceptionEnum.IntentNotFoundException);
        } else {
            return intent;
        }
    }

    public async tryProcessAsync(input: string, currentState: UserState) {
        if (currentState == null) return;
        //Try Get Intent
        if (currentState.intent == null) {
            let intent = this.tryGetIntent(input);
            currentState.intent = input;
            await this.tryProcessAsync(input, currentState);
            return;
        }
        //Try get State      
        if (currentState.state == null) {
            let intent = this.tryGetIntent(input);
            let stateKey = intent.startAt;
            let outStateType: IOutType<string> = <any>{};
            let state = this.tryGetState(stateKey, intent, outStateType);
            currentState.state = stateKey;
            await this.tryProcessAsync(input, currentState);
            return;
        }

        //Process State
        let intentKey = currentState.intent;
        let outStateType: IOutType<string> = <any>{};
        let stateKey = currentState.state;
        let intent = this.tryGetIntent(intentKey);
        let state = this.tryGetState(stateKey, intent, outStateType);
        switch (outStateType.out) {
            case ActionEnum.collectInput:
                state = <ICollectInputState>state;
                this.CollectInput(state, input);
                break;
            case ActionEnum.confirm:
                state = <IConfirmationState>state;
                this.Confirm(state, input);
                break;
            case ActionEnum.sendExternal:
                state = <ISendExternalState>state;
                await this.trySendExternalAsync(state);
                break;
            case ActionEnum.sendMessage:
                state = <ISendMessageState>state;
                this.trySendMessageAsync(state);
                break;
            default:
                throw (ExceptionEnum.UnknownActionException);
        }
        //Advance to next State
        let nextAction = (<IState>state).next;
        let wait = (<IState>state).wait;
        if (nextAction != null) {
            currentState.state = nextAction;
            if (wait != true) {
                await this.tryProcessAsync(input, currentState);
                return;
            }
        } else {
            currentState.state = undefined;
            currentState.intent = undefined;
            currentState.payload = undefined;
            currentState.waiting = undefined;
        }
        return;
    }

    public async ProcessAsync(input) {
        try {
            let sessionKey = this.userIdAppKey[0] + '-' + this.userIdAppKey[1];
            let state = this.storage.get(sessionKey);
            this.currentState = <UserState>JSON.parse(state);
            await this.tryProcessAsync(input, this.currentState);
            this.storage.set(sessionKey, this.currentState)
        } catch (e) {
            this.exceptionHandler.handle(e);
        }
    }

    // Class Properties and constructors 
    private convoMap: IConvoMap;
    private currentState: UserState | null;
    private storage: IStorage;
    private userIdAppKey: [string, string];
    private messageHandler: IMessageHandler;
    private exceptionHandler: IExceptionHandler;

    public constructor(
        userIdAppKey: [string, string],
        convoMap?: IConvoMap,
        storage?: IStorage,
        messageHandler?: IMessageHandler,
        exceptionHandler?: IExceptionHandler
    ) {
        this.convoMap = (convoMap) ? convoMap : Global.conversationMap;
        this.storage = (storage) ? storage : Global.storage;
        this.currentState = null;
        this.userIdAppKey = userIdAppKey;
        this.messageHandler = (messageHandler) ? messageHandler : Global.MessageHandler;
        this.exceptionHandler = (exceptionHandler) ? exceptionHandler : Global.ExceptionHandler;
    }
}