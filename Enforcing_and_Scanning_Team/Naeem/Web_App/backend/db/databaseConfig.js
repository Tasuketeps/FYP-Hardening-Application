// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const mysql = require("mysql");

var dbconnect = {
    getConnection: function () {
    var conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1qwer$#@!', //your own password
        database: 'ahs_wos',
        dateStrings: true
    });
    return conn;
    }
  };
  

module.exports = dbconnect;
