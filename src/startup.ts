// import { Reader } from "./reader";
// import express from "express";
// import { IConvoMap } from "./Interfaces/IConversationMap";
// import { NodePersistStorage } from "./NodePersistStorage";
// var app = express();
// var data = require("../src/testfiles/testConvo.json");

// const convoMap = data as IConvoMap
// const storage = new NodePersistStorage();
// app.get('/', async function (req: any, res: any) {
//   let userId = req.query['userId'];
//   let appId = req.query['appId'];
//   let input = req.query['input'];
//   let reader = new Reader(convoMap, storage, [userId, appId])
//   await reader.ProcessAsync(input);
//   res.send(req.query);
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');

// });
