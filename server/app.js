let express = require("express");
let app = express();
let expressWs = require("express-ws")(app);
let redis = require("redis");

const client = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || "localhost"
);

messages = [];
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res, next) {
  console.log("GET ROUTE");
  return res.send("Get route");
});

app.ws("/", function(ws, req) {
  ws.on("message", function(msg) {
    console.log("SOCKET MESSAGE");
    client.set("doc", msg);
    expressWs.getWss().clients.forEach(client => {
      console.log(msg);
      client.send(msg);
    });
  });
  //TODO: Fix this to connection and repush to dockerhub
  ws.on("connection", function(ws) {
    console.log("Trying to connect");
    ws.send("AOSIJDOASIDJ");
    client.get("doc", (err, res) => {
      if (err) {
        ws.send(`Error: ${err}`);
      } else {
        ws.send(res);
      }
    });
  });
});

app.ws("/addmessage", function(ws, req) {
  ws.on("message", function(msg) {
    console.log("Received message from client", msg);
    let message = {
      content: `${msg}`
    };
    messages.push(message);
    console.log("Updated messages", messages, typeof messages);
    expressWs.getWss().clients.forEach(client => {
      client.send(JSON.stringify(messages));
    });
  });
});

app.listen(3001, err => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:3001");
});
