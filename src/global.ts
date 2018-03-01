import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { ConsoleMessageHandler, ConsoleExceptionHandler } from "./utilities/console";
import { IExceptionHandler } from "./Interfaces/IExceptionHandler";
import { IActionMap } from "./Interfaces/IActionMap";
import { IConvoMap } from "./Interfaces/IConversationMap";
import { IStorage } from "./Interfaces/IStorage";
import { NodePersistStorage } from "./utilities/storage";

export var MessageHandler: IMessageHandler
    = new ConsoleMessageHandler();

export var storage: IStorage
    = new NodePersistStorage();

export var ExceptionHandler: IExceptionHandler
    = new ConsoleExceptionHandler();

export var tokenMap: IActionMap
    = require("../testfiles/actionMap.json");

export var conversationMap: IConvoMap
    = require("../testfiles/testConvo.json");



