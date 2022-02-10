import { v4 as uuid } from "uuid";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import path from "path";

const __dirname = path.resolve();

const PORT = 80;
const INDEX = "/index.html";

console.log("before express.use()");

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.id = uuid();
  console.log("client connected");

  ws.on("message", function message(info, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("sending to clients: ", info.toString("utf8"));
        client.send(info.toString("utf8"), { binary: isBinary });
      }
    });
  });
});
