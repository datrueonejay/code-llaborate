const express = require('express');
const query = require('./queries.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3006;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("hello world");
});

app.post('/db/adduser/', (req, res) => {
  let role = req.body.role;
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;

  return query.addUser(role, username, password, name, function(err, results) {
    if (err) return res.status(406).end(err);
    res.send(results);
  });
})

app.post('/db/checkuser/', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  return query.checkUser(username, password, function(err, results) {
    if (err) return res.status(418).end(err);
    res.send(results);
  })
})



app.listen(port, ()=> {console.log(`Server on port ${port}`)})