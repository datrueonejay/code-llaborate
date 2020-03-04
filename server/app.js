var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);

app.get("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  return res.send("Get route");
});

app.ws("/", function(ws, req) {
  ws.on("message", function(msg) {
    expressWs.getWss().clients.forEach((client) => {
      client.send(msg);
    })

  });
});

app.listen(3001);
