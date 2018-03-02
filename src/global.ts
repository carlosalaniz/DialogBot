import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { ConsoleMessageHandler, ConsoleExceptionHandler } from "./utilities/console";
import { IExceptionHandler } from "./Interfaces/IExceptionHandler";
import { IActionMap } from "./Interfaces/IActionMap";
import { IConvoMap } from "./Interfaces/IConversationMap";
import { IStorage } from "./Interfaces/IStorage";
import { NodePersistStorage } from "./utilities/storage";

export const timeout = 10;

export const MessageHandler: IMessageHandler
    = new ConsoleMessageHandler();

export const storage: IStorage
    = new NodePersistStorage();

export const ExceptionHandler: IExceptionHandler
    = new ConsoleExceptionHandler();

export const tokenMap: IActionMap
    = require("../testfiles/actionMap.json");

export const conversationMap: IConvoMap
    = require("../testfiles/testConvo.json");



