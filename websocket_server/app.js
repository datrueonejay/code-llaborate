const WebSocket = require("ws");
let redis = require("redis");
const client = redis.createClient(6379, "redis");
// const client = redis.createClient();

const wss = new WebSocket.Server({ port: 3001 }, () => {
  console.log("SERVER SET UP");
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    client.set("doc", message);
    wss.clients.forEach(client => {
      console.log(message);
      client.send(message);
    });
  });

  client.get("doc", (err, res) => {
    if (err) {
      ws.send(`Error: ${err}`);
    } else {
      ws.send(res ? res : "");
    }
  });
});
