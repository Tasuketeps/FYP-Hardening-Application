const db = require('../db/databaseConfig');

const baseline = {
	insertBaseline: function (filename,callback) {
        var dbConn = db.getConnection();
        // Select email, to check if email exists
        const sql ="INSERT INTO baselines (filename) VALUES (?)";
        dbConn.query(sql, [filename], (error, results) => {
          if (error) {
            dbConn.end();
            return callback(error, null);
          }
          else {
            dbConn.end();
            return callback(null, results);
          }
        });
      },
        getAllBaseline: function (callback) {
        var dbConn = db.getConnection();
        // Select email, to check if email exists
        const sql ="select * from baselines;";
        dbConn.query(sql, (error, results) => {
          if (error) {
            dbConn.end();
            return callback(error, null);
          }
          else {
            dbConn.end();
            return callback(null, results);
          }
        });
      },
        getBaseline: function (filename,callback) {
        var dbConn = db.getConnection();
        // Select email, to check if email exists
        const sql ="select * from baselines where filename = ?;";
        dbConn.query(sql,[filename], (error, results) => {
          if (error) {
            dbConn.end();
            return callback(error, null);
          }
          else {
            dbConn.end();
            return callback(null, results);
          }
        });
      }
}
module.exports = baseline
