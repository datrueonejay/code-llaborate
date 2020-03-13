const WebSocket = require("ws");
let redis = require("redis");
const url = require("url");

let http = require("http");

const server = http.createServer();

const client = redis.createClient(
  process.env.REDIS_URL || "redis://localhost:6379"
);
// const client = redis.createClient(6379, "redis");
// const client = redis.createClient();

// const wss = new WebSocket.Server({ server }, () => {
//   console.log("SERVER SET UP");
// });

// const wss = new WebSocket.Server({ port: 8080 }, () => {
//   console.log("SERVER SET UP");
// });

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", function connection(ws) {
  console.log("Trying to connect");
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

server.on("upgrade", (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  console.log("pathname");
  console.log(pathname);
  if (pathname === "/") {
    wss.handleUpgrade(request, socket, head, ws => {
      console.log("Emitting request");
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);
