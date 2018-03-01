import { NodePersistStorage } from "./utilities/storage";
import { Reader } from "./reader";
import * as Global from "./global";

const stdin = process.openStdin();
const userId = "2238706842821354";
const appId = "1788271627919179";
const reader = new Reader([userId, appId]);
stdin.addListener("data", async function (buffer) {
    let input = buffer.toString().trim()
    await reader.ProcessAsync(input);
});
