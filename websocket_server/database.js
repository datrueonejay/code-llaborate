let mysql = require("mysql");
let crypto = require("crypto");

let connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "JayJayRay",
  insecureAuth: true,
});

let connect = () =>
  connection.connect(function (err) {
    if (err) {
      console.error(err);
      connect();
      return;
    }
  });

exports.addUser = (role, username, password, name, cb) => {
  let roleId;
  return findRole(role, function (err, results) {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    if (results.length === 0) {
      return cb("Error finding role", null);
    }
    roleId = results[0].ID;
    role = results[0].Role;

    return findUser(username, function (err, results) {
      if (err) {
        console.error(err);
        return cb("Internal Server Error", null);
      }
      if (results.length > 0) {
        return cb("User already exists", null);
      }

      // Sauce from lab7 CSCC09
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto.createHmac("sha512", salt);
      hash.update(password);
      let saltedHash = hash.digest("base64");
      // end of sauce

      let sql =
        "INSERT INTO Users(RoleID, Username, Password, Salt, Name) VALUES (?, ? ,? ,? ,?)";
      return connection.query(
        sql,
        [roleId, username, saltedHash, salt, name],
        (err, result, fields) => {
          if (err) return cb(err.message, null);
          return cb(null, {
            id: result.insertId,
            roleId: roleId,
            username: username,
            name: name,
            role: role,
          });
        }
      );
    });
  });
};

exports.checkUser = (username, password, cb) => {
  return findUser(username, function (err, results) {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    if (results.length > 0) {
      // Sauce from lab7 CSCC09
      let salt = results[0].Salt;
      let hash = crypto.createHmac("sha512", salt);
      hash.update(password);
      let saltedHash = hash.digest("base64");
      // end of sauce

      let userPass = results[0].Password;
      if (userPass == saltedHash) {
        let ret = {
          id: results[0].ID,
          name: results[0].name,
          username: results[0].Username,
          role: results[0].Role,
          roleId: results[0].RoleID,
        };
        return cb(null, ret);
      }
    } else {
      return cb("Invalid Username and Password Combination", null);
    }
  });
};

exports.isStudent = (username, cb) => {
  return findUser(username, (err, results) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    if (results.length > 0) {
      return cb(null, results[0].Role === "STUDENT");
    } else {
      return cb("No user exists", null);
    }
  });
};

exports.verifyPersonClass = (username, course, role, cb) => {
  return findPersonClass(username, course, role, (err, res) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    return cb(null, results.length > 0);
  });
};

exports.findClasses = (username, cb) => {
  return findClasses(username, (err, res) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    return cb(
      null,
      res.map((course, index) => {
        return course.CourseID;
      })
    );
  });
};

exports.searchUser = (query, cb) => {
  let sql =
    "SELECT Name, Users.ID, Role FROM Users inner join Roles where Roles.ID = Users.RoleID and Name like" +
    connection.escape("%" + query + "%");
  return connection.query(sql, [query], (err, results) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    return cb(null, results);
  });
};

exports.getUsers = (page = 0, cb) => {
  let sql =
    "SELECT Name, Users.ID, Role FROM Users inner join Roles on Users.RoleID = Roles.ID ORDER BY ID LIMIT ?, 25";
  return connection.query(sql, [page * 25], (err, results) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    return cb(null, results);
  });
};

exports.getCourses = (page = 0, cb) => {
  let sql = "SELECT * from Courses ORDER BY ID LIMIT ?, 25";
  return connection.query(sql, [page * 25], (err, results) => {
    if (err) {
      console.error(err);
      return cb("Internal Server Error", null);
    }
    return cb(null, results);
  });
};

exports.addToCourse = (userID, courseID, cb) => {
  return checkUserCourse(userID, courseID, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    let sql = "INSERT INTO UserCourses VALUES (?, ?)";
    return connection.query(sql, [userID, courseID], (err, results) => {
      if (err) {
        console.error(err);
        return cb("Internal Server Error", null);
      }
      return cb(null, results);
    });
  });
};

exports.findRole = findRole;

exports.checkCourse = (courseID, cb) => {
  return findCourse(courseID, (err, result) => {
    if (err) return cb(err, null);
    return cb(null, result);
  });
};

function findClasses(username, cb) {
  let sql =
    "SELECT CourseID FROM UserCourses as c inner join Users where c.UserID = Users.ID and Username=?";
  return connection.query(sql, [username], cb);
}

function findPersonClass(username, course, role, cb) {
  let sql =
    "SELECT * FROM UserCourses as c inner join Users where c.UserID = Users.ID and Username=? and CourseID=? and RoleID=?";
  return connection.query(sql, [username, course, role], cb);
}

function findUser(username, cb) {
  let sql =
    "SELECT user.ID, RoleID, Username, name, Role, Salt, Password from Users as user INNER JOIN Roles as role where role.ID = user.RoleID and user.username=?";
  return connection.query(sql, [username], cb);
}

function findCourse(courseID, cb) {
  let sql = "SELECT * from Courses WHERE ID=?";
  return connection.query(sql, [courseID], cb);
}

function findRole(role, cb) {
  let sql = "SELECT * from Roles where Role=?";
  return connection.query(sql, [role], cb);
}

function checkUserCourse(userId, courseID, cb) {
  let sql = "SELECT * FROM UserCourses WHERE UserID=? and CourseID=?";
  return connection.query(sql, [userId, courseID], cb);
}
