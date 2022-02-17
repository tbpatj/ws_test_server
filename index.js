import express from "express";
import expressWs from "express-ws";
import http from "http";

let incrementID = 0;
let players = {};
let oldPlayers = {};
let port = 3001;

//app and server creation
let app = express();
let server = http.createServer(app).listen(port);

//apply expressWs
expressWs(app, server);

//get the /ws websocket route
app.ws("/ws", async function (ws, req) {
  let id = -1;
  let intervalID = setInterval(function () {
    console.log("updating");
    ws.send(
      JSON.stringify({
        text: "updatePlayers",
        players: players,
      })
    );
  }, 10);
  ws.on("message", async function (msg) {
    //print out the message
    let data = JSON.parse(msg);

    if (data.text === "requestingID") {
      ws.send(JSON.stringify({ text: "sendingID", id: incrementID }));
      id = incrementID;
      incrementID++;
    }
    if (data.text === "updatingMyPlay") {
      console.log(data);
      players[data.id] = { x: data.x, y: data.y };
      incrementID++;
    }
  });
  ws.on("close", async function () {
    console.log("cleared");
    clearInterval(intervalID);
    delete players[id];
  });
});

console.log("I think its running");
