let mysql = require('mysql');
let crypto = require('crypto');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'JayJayRay',
  insecureAuth: true
});

connection.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("connected as id ", connection.threadId);
});


exports.addUser = (role, username, password, name, cb) => {
  findRole(role, function(err, results) {
    if (err) return cb("Error finding role", null);
    role = results[0].ID;
  })

  findUser(username, function(err, results) {
    if (results.length > 0) {
      return cb("User already exists", null);
    }

    // Sauce from lab7 CSCC09
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let saltedHash = hash.digest('base64');
    // end of sauce

    let sql = "INSERT INTO Users(RoleID, Username, Password, Salt, Name) VALUES (?, ? ,? ,? ,?)";
    connection.query(sql, [role, username, saltedHash, salt, name], function(err, results, fields) {
      if (err) return cb(err, null);
      cb(null, results);
    })
  });
}

exports.checkUser = (username, password, cb) => {

  findUser(username, function(err, results) {
    if (results.length > 0) {
      // Sauce from lab7 CSCC09
      let salt = results[0].Salt;
      let hash = crypto.createHmac('sha512', salt);
      hash.update(password);
      let saltedHash = hash.digest('base64');
      // end of sauce

      let userPass = results[0].Password;

      if (userPass == saltedHash) {
        let ret = {
          name: results[0].name,
          username: results[0].Username,
          role: results[0].Role,
        }
        return cb(null, ret);
      }
    } 
    return cb("Jayden said you're unauthorized", null);
  });
}

function findUser(username, cb) {
  console.log(username);
  let sql = "SELECT Username, name, Role, Salt, Password from Users as user INNER JOIN Roles as role where role.ID = user.RoleID and user.username=?";
  connection.query(sql, [username], cb);
}

function findRole(role, cb) {
  let sql = "SELECT * from Roles where Role=?";
  connection.query(sql, [role], cb);
}

