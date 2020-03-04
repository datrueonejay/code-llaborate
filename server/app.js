var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);

messages = [];

app.get("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  return res.send("Get route");
});

app.ws("/", function(ws, req) {
  ws.on("message", function(msg) {
    expressWs.getWss().clients.forEach((client) => {
      console.log(msg);
      client.send(msg);
    })
  });
});

app.ws("/addmessage", function(ws, req) {
  ws.on("message", function(msg) {
    console.log("Received message from client", msg);
    let message = {
      content: `${msg}`
    }
    messages.push(message);
    console.log("Updated messages", messages, typeof(messages));
    expressWs.getWss().clients.forEach((client) => {
      client.send(JSON.stringify(messages));
    })
  })
})

app.listen(3001);
