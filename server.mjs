import { v4 as uuid } from "uuid";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import path from "path";

const __dirname = path.resolve();

const PORT = process.env.PORT || 8080;
const INDEX = "/index.html";

console.log("before express.use()");

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server });

const store = [
  {
    x: -1,
    y: -1.600000023841858,
    z: -5.838443756103516,
    id: "b50ac17a-6ea3-4914-8e2a-19b2c32ccb8d",
  },
  {
    x: 0,
    y: -1.600000023841858,
    z: -5.838443756103516,
    id: "b50ac17a-6ea3-2914-8e2a-19b2c32ccb8d",
  },
  {
    x: 1,
    y: -1.600000023841858,
    z: -5.838443756103516,
    id: "b50ac17a-6ea3-4924-8e2a-19b2c32ccb8d",
  },
];

wss.on("connection", function connection(ws) {
  ws.id = uuid();
  console.log("client connected");
  store.forEach((obj) => ws.send(obj.toString("utf8")));

  ws.on("message", function message(info, isBinary) {
    store.push(info);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("sending to clients: ", info.toString("utf8"));
        client.send(info.toString("utf8"), { binary: isBinary });
      }
    });
  });
});
