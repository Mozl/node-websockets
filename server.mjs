import { v4 as uuid } from "uuid";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import path from "path";

const __dirname = path.resolve();

const PORT = process.env.PORT || 8080;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server });

let store = [];

wss.on("connection", function connection(ws) {
  ws.id = uuid();
  console.log("client connected", ws.id);
  store.forEach((obj) => {
    ws.send(obj);
  });

  ws.on("message", function message(info, isBinary) {
    info = info.toString("utf8");
    console.log("info: ", info);
    if (info.includes("clear")) {
      console.log("clearing store");
      store = [];
      return;
    }
    store.push(info);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("sending to clients: ", info);
        client.send(info, { binary: isBinary });
      }
    });
  });
});
