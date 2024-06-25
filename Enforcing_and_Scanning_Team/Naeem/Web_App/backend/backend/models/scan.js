// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const db = require("../db/databaseConfig")

const scan = {
  savePolicy: function (scanned_filename, ipaddress, created_at, lastscan_at, callback) {

    var conn = db.getConnection();
    var sql ="INSERT INTO scans (scanned_filename, ipaddress, created_at, lastscan_at) VALUES (?, ?, ?, ?)";
        conn.query(sql, [scanned_filename, ipaddress, created_at, lastscan_at], (error, results) => {
	conn.end()
          if (error) {
            return callback(error, null);
          }
          else {
            return callback(null, results);
          }
        });    
    },
  checkScan: function(ipaddress, callback){
    var conn = db.getConnection();
    var sql = 
	`
	SELECT *
FROM scans t1
WHERE created_at = (
    SELECT MAX(created_at)
    FROM scans t2
    WHERE t1.ipaddress = t2.ipaddress
      AND t2.ipaddress = ?
)
AND t1.ipaddress = ?;
	` 
conn.query(sql, [ipaddress,ipaddress], (error, results) => {
        conn.end()
          if (error) {
            return callback(error, null);
          }
          else {
            return callback(null, results);
          }
        });
 },
findFilename: function(scanid, callback){
    var conn = db.getConnection();
    var sql =
        `
        SELECT *
FROM scans t1
WHERE created_at = (
    SELECT MAX(created_at)
    FROM scans t2
    WHERE t1.scanid = t2.scanid
      AND t2.scanid = ?
)
AND t1.scanid = ?;
        `
conn.query(sql, [scanid, scanid], (error, results) => {
        conn.end()
          if (error) {
            return callback(error, null);
          }
          else {
            return callback(null, results);
          }
        });
 },
getPolicyName: function (scanid, callback) {

    var conn = db.getConnection();
    var sql ="select * from scans where scanid=?;";
        conn.query(sql, [scanid], (error, results) => {
        conn.end()
          if (error) {
            return callback(error, null);
          }
          else {
            return callback(null, results);
          }
        });
    }

  
}

module.exports = scan
