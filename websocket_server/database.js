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
      console.log(err);
      connect();
      return;
    }

    console.log("connected as id ", connection.threadId);
  });

exports.addUser = (role, username, password, name, cb) => {
  let roleId;
  findRole(role, function (err, results) {
    if (err || results.length === 0) return cb("Error finding role", null);
    roleId = results[0].ID;
    role = results[0].Role;
  });

  findUser(username, function (err, results) {
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
    connection.query(
      sql,
      [roleId, username, saltedHash, salt, name],
      (err, result, fields) => {
        if (err) return cb(err.message, null);
        cb(null, {
          id: result.insertId,
          roleId: roleId,
          username: username,
          name: name,
          role: role,
        });
      }
    );
  });
};

exports.checkUser = (username, password, cb) => {
  findUser(username, function (err, results) {
    if (err) return cb(err, null);
    if (results.length > 0) {
      // Sauce from lab7 CSCC09
      let salt = results[0].Salt;
      let hash = crypto.createHmac("sha512", salt);
      hash.update(password);
      let saltedHash = hash.digest("base64");
      // end of sauce

      let userPass = results[0].Password;
      if (userPass == saltedHash) {
        console.log(results);

        let ret = {
          id: results[0].ID,
          name: results[0].name,
          username: results[0].Username,
          role: results[0].Role,
          roleId: results[0].RoleID,
        };
        return cb(null, ret);
      }
    }
    return cb("Jayden said you're unauthorized", null);
  });
};

exports.isStudent = (username, cb) => {
  findUser(username, (err, results) => {
    if (err) return cb(err, null);
    return cb(null, results[0].Role === "STUDENT");
  });
};

exports.verifyPersonClass = (username, course, role, cb) => {
  findPersonClass(username, course, role, (err, res) => {
    if (err) return cb(err, null);
    return cb(null, results.length > 0);
  });
};

exports.findClasses = (username, cb) => {
  findClasses(username, (err, res) => {
    if (err) return cb(err.message, null);
    console.log("DATABASE");
    console.log(res);
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
  connection.query(sql, [query], cb);
};

exports.getUsers = (page = 0, cb) => {
  let sql =
    "SELECT Name, Users.ID, Role FROM Users inner join Roles on Users.ID = Roles.ID ORDER BY ID LIMIT ?, 50";
  connection.query(sql, [page * 50], cb);
};

//TODO: perhaps change it so only the isntructors who are a part of the course can see the course???????
exports.getCourses = (cb) => {
  let sql = "SELECT * from Courses";
  connection.query(sql, cb);
};

exports.addToCourse = (userID, courseID, cb) => {
  // // Make sure it is a real user
  // findUserById(studentID, (err, res) => {
  //   if (err) return cb(err, null);

  //   // Make sure it is a real course
  //   findCourseById(courseID, (err, res) => {
  //     if (err) return cb(err, null);
  //     let sql = "INSERT INTO UserCourses VALUES (?, ?)";
  //     connection.query(sql, [studentID, courseID], cb);
  //   });
  // });
  checkUserCourse(userID, courseID, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    let sql = "INSERT INTO UserCourses VALUES (?, ?)";
    connection.query(sql, [userID, courseID], cb);
  });
};

exports.checkCourse = (courseID, cb) => {
  findCourse(courseID, (err, result) => {
    if (err) return cb(err, null);
    return cb(null, result);
  });
};

function findClasses(username, cb) {
  let sql =
    "SELECT CourseID FROM UserCourses as c inner join Users where c.UserID = Users.ID and Username=?";
  connection.query(sql, [username], cb);
}

function findPersonClass(username, course, role, cb) {
  let sql =
    "SELECT * FROM UserCourses as c inner join Users where c.UserID = Users.ID and Username=? and CourseID=? and RoleID=?";
  connection.query(sql, [username, course, role], cb);
}

function findUser(username, cb) {
  console.log(username);
  let sql =
    "SELECT user.ID, RoleID, Username, name, Role, Salt, Password from Users as user INNER JOIN Roles as role where role.ID = user.RoleID and user.username=?";
  connection.query(sql, [username], cb);
}

function findCourse(courseID, cb) {
  let sql = "SELECT * from Courses WHERE ID=?";
  connection.query(sql, [courseID], cb);
}

function findRole(role, cb) {
  let sql = "SELECT * from Roles where Role=?";
  connection.query(sql, [role], cb);
}

function findUserById(studentID, cb) {
  let sql =
    "SELECT user.ID, RoleID, Username, name, Role, Salt, Password from Users as user INNER JOIN Roles as role where role.ID = user.RoleID and user.ID=?";
  connection.query(sql, [studentID], cb);
}

function findCourseById(courseID, cb) {
  let sql = "SELECT * from Courses where ID=?";
  connection.query(sql, [courseID], cb);
}

function checkUserCourse(userId, courseID, cb) {
  let sql = "SELECT * FROM UserCourses WHERE UserID=? and CourseID=?";
  connection.query(sql, [userId, courseID], cb);
}
