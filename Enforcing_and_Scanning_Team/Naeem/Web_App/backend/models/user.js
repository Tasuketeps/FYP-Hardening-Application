// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const db = require("../db/databaseConfig")
const path = require('path');
var config = require('../config.js')
var jwt = require('jsonwebtoken');

const user = {
  loginUser: function (username, password, callback) {

    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      else {
        console.log("Connected!");

        var sql = 'select * from users where username = ? and password = ?';

        conn.query(sql, [username, password], function (err, result) {
          conn.end();

          if (err) {
            console.log("Err: " + err);
            return callback(err, null, null);
          } else {
            var token = "";
            var i;
            if (result.length == 1) {

              token = jwt.sign({ id: result[0].userid }, config.key, {
                expiresIn: 86400 //expires in 24 hrs
              });
              console.log("@@token " + token);
              return callback(null, token, result);


            } else {
              var err2 = new Error("UserID/Password does not match.");
              err2.statusCode = 500;
              return callback(err2, null, null);
            }
          }  //else
        });
      }
    });
  },

  
    insert: function(user, callback) {
    var dbConn = db.getConnection();
    dbConn.connect(function (err) {
    
        if (err) {//database connection gt issue!
            console.log(err);
            return callback(err, null);
          } else {

   const insertUserQuery =
   `
   INSERT INTO user (username, email, password, type)
   VALUES (?, ?, ?, ?);
   `;
   dbConn.query(
     insertUserQuery,
     [user.username, user.email, user.password, user.type],
     (error, results) => {
   dbConn.end();
        if (error) {
        console.log(error)
        return callback(error, null);
       
     };
     return callback(null, results.insertId);
    });
   }
  });
},



  
}
module.exports = user
