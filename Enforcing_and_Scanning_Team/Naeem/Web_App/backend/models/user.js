// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const db = require("../db/databaseConfig")
const path = require('path');
var config = require('../config.js')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


const user = {
  loginUser: function (username, password, callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log('Database connection failed:', err);
        return callback(err, null);
      } else {
        console.log("Connected to database!");

        var sql = 'SELECT * FROM users WHERE username = ?';

        conn.query(sql, [username], function (err, result) {
          conn.end();

          if (err) {
            console.log("Error querying database:", err);
            return callback(err, null, null);
          } else if (result.length === 0) {
            console.log("User not found");
            var err2 = new Error("UserID/Password does not match.");
            err2.statusCode = 500;
            return callback(err2, null, null);
          } else {
            bcrypt.compare(password, result[0].password, function (err, isMatch) {
              if (err) {
                console.log("Error comparing passwords:", err);
                return callback(err, null, null);
              }
              if (isMatch) {
                var token = jwt.sign({ userid: result[0].userid, type: result[0].type }, config.key, {
                  expiresIn: 86400 // expires in 24 hrs
                });
                console.log("@@token " + token);
                return callback(null, token, result);
              } else {
                console.log("Password does not match");
                var err2 = new Error("UserID/Password does not match.");
                err2.statusCode = 500;
                return callback(err2, null, null);
              }
            });
          }
        });
      }
    });
  },
    insertUsers: function (newUser, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log('Database connection failed:', err);
        return callback(err, null);
      } else {
        const { username, email, password } = newUser;
        bcrypt.hash(password, 10, function (err, hashPassword) {
          if (err) {
            console.log("Error hashing password:", err);
            return callback(err, null);
          }
          var sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?);';
          conn.query(sql, [username, email, hashPassword], function (err, result) {
            conn.end();
            if (err) {
              console.log("Error inserting user into database:", err);
              return callback(err, null);
            } else {
              console.log("User registered successfully with ID:", result.insertId);
              return callback(null, result.insertId);
            }
          });
        });
      }
    });
  },
updateUser: function (currentPassword, newPassword, repeatPassword, userid, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log("Database connection error:", err);
            return callback(err, null);
        }

        console.log("Connected to database in updateUser function.");

        var validateSql = 'SELECT password FROM users WHERE userid = ?';
        conn.query(validateSql, [userid], function (err, rows) {
            if (err) {
                conn.end();
                console.log("Error executing SELECT query:", err);
                return callback(err, null);
            }

            if (rows.length === 0) {
                conn.end();
                console.log("User not found for userid:", userid);
                return callback(new Error('User not found.'), null);
            }

            var storedPassword = rows[0].password;
            if (storedPassword !== currentPassword) {
                conn.end();
                console.log("Current password does not match for userid:", userid);
                return callback(new Error('Current password is incorrect.'), null);
            }

            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                conn.end();
                return callback(new Error('Password must be 8 or more characters long, have at least a number, a special character, an uppercase and a lowercase letter'), null);
            }

            if (newPassword !== repeatPassword) {
                conn.end();
                return callback(new Error('Passwords do not match!'), null);
            }

            var updateSql = 'UPDATE users SET password = ? WHERE userid = ?';
            conn.query(updateSql, [newPassword, userid], function (err, result) {
                conn.end();
                if (err) {
                    console.log("Error updating password:", err);
                    return callback(err, null);
                } else {
                    console.log("Password updated successfully.");
                    return callback(null, result.insertId);
                }
            });
        });
    });
},
insertSshUser: function (ipaddress,username, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = 'INSERT INTO ssh_users (ipaddress,username) VALUES (?,?);';
        conn.query(sql, [ipaddress,username], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result.insertId);
          }
        });
      }
    });
  },
getSshUsers: function (callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = 'select * from ssh_users;';
        conn.query(sql,function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },
getSshUser: function (ipaddress,callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = 'select * from ssh_users where ipaddress = ?';
        conn.query(sql,[ipaddress],function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }
	 else if (result.length === 0){
		var noUserError = { code: 'NO_USER_FOUND', message: 'No user found for IP address: ' + ipaddress }
		return callback(noUserError ,null);
	}
	 else {
            return callback(null, result);
          }
        });
      }
    });
  },
	editSshUser: function (ipaddress,username, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        var sql = 
`
UPDATE ssh_users
SET username = ?
where ipaddress = ?;
`;
        conn.query(sql, [username,ipaddress], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  }
}

module.exports = user
