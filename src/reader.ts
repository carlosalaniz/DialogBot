import storage from 'node-persist'

export class Reader {
    async trySendMessageAsync(state: ISendMessageState) {
        let replaceFieldKey = state.field_key;
        let messages = state.message.text;
        let messageQuickReplies = state.message.quickreply;
        for (let i = 0, message = messages[i]; i < messages.length; i++ , message = messages[i]) {
            console.log("Processing messages:", message);
            for (let j = 0, messageText = message[j]; j < messages.length; j++ , messageText = message[j]) {
                console.log("Sending message:", messageText);
                //todo: send messages
                console.log("Sent.");
            }
            console.log("Processed.");
        }
    }

    async trySendExternalAsync(state: ISendExternalState) {
        if (this.currentState == null) return;
        let data = this.currentState.payload;
        let uri = state.uri;
        let method = state.method;
        console.log("Data to be sent ", data);
        console.log("Seding Data to ", uri, " through ", method);
        //todo: send data to external service
        console.log("Sent.")
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
            return undefined;
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
    tryGetIntent(intentKey: string): IIntent {
        let intent = this.convoMap[intentKey];
        if (intent == null) {
            throw (ExceptionEnum.IntentNotFoundException)
        } else {
            return intent;
        }
    }


    public async tryProcessAsync(input: string) {
        if (this.currentState == null) return;
        //Try Get Intent
        if (this.currentState.intent == null) {
            let intent = this.tryGetIntent(input);
            this.currentState.intent = input;
            await this.tryProcessAsync(input);
            return;
        }

        //Try get State
        if (this.currentState.state == null) {
            let intent = this.tryGetIntent(input);
            let stateKey = intent.startAt;
            let outStateType: IOutType<string> = <any>{};
            let state = this.tryGetState(input, intent, outStateType);
            this.currentState.state = stateKey;
            await this.tryProcessAsync(input);
            return;
        }

        //Process State
        let intentKey = this.currentState.intent;
        let outStateType: IOutType<string> = <any>{};
        let stateKey = this.currentState.state;
        let intent = this.tryGetIntent(input);
        let state = this.tryGetState(input, intent, outStateType);
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
            this.currentState.state = nextAction;
            if (wait != true) {
                await this.tryProcessAsync(input);
                return;
            }
        } else {
            this.currentState.state = undefined;
            this.currentState.intent = undefined;
            this.currentState.payload = undefined;
            this.currentState.waiting = undefined;
        }
        return;
    }

    public async ProcessAsync(input) {
        try {
            let sessionKey = this.userIdAppKey[0] + '-' + this.userIdAppKey[1];
            this.currentState = JSON.parse(this.storage.get(sessionKey));
            console.log(this.currentState);
            await this.tryProcessAsync(input);
            this.storage.set(sessionKey, JSON.stringify(this.currentState))
        } catch (e) {
            switch (e) {
                case ExceptionEnum.IntentNotFoundException:
                case ExceptionEnum.InvalidActionNameException:
                case ExceptionEnum.InvalidStateFormatException:
                case ExceptionEnum.UnknownActionException:
                case ExceptionEnum.UnknownException:
                    console.log(e);
                default:
                    console.log("Something wierd happend D:");
            }
        }
    }

    // Class Properties and constructors 
    private convoMap: IConvoMap;
    private currentState: UserState | null;
    private storage: IStorage;
    private userIdAppKey: [string, string];
    public constructor(convoMap: IConvoMap, storage: IStorage,
        userIdAppKey: [string, string]) {
        this.convoMap = convoMap;
        this.storage = storage;
        this.currentState = null;
        this.userIdAppKey = userIdAppKey;
    }
}

interface IStorage {
    get(key: string): string;
    set(key: string, value: string);
}

export class NodePersistStorage implements IStorage {
    get(key: string): string {
        storage.initSync();
        let session = storage.getItemSync(key);
        if (session == null)
            storage.setItemSync(key, {})
        return storage.getItemSync(key);
    }
    set(key: string, value: string) {
        storage.initSync();
        storage.setItemSync(key, value);
    }
}