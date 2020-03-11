const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    wss.clients.forEach(client => {
      console.log(message);
      client.send(message);
    });
  });

  ws.send("successfully connected");
});
