const db = require('../db/databaseConfig');

const benchmark = {
	insertBenchmark: function (original_filename, csv_filename,callback) {
        var dbConn = db.getConnection();
        // Select email, to check if email exists
        const sql ="INSERT INTO benchmarks (original_filename, csv_filename) VALUES (?, ?)";
        dbConn.query(sql, [original_filename, csv_filename], (error, results) => {
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
        findAllBenchmarks: function (callback) {
        var dbConn = db.getConnection();
        const sql =
	`SELECT b.csv_filename
FROM benchmarks b
JOIN (
    SELECT original_filename, MAX(benchmarkid) AS latest_id
    FROM benchmarks
    GROUP BY original_filename
) AS latest_b
ON b.benchmarkid = latest_b.latest_id;
`;
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
      }


















}
module.exports = benchmark
