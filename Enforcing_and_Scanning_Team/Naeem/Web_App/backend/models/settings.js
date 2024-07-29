const db = require('../db/databaseConfig');

const setting = {
    updateSettings: function (userid, ipaddr, callback) {
        const conn = db.getConnection();
        const sqlCheck = "SELECT COUNT(*) AS count FROM settings WHERE userid = ?";
        conn.query(sqlCheck, [userid], (error, results) => {
            if (error) {
                conn.end();
                return callback(error, null);
            } else {
                const count = results[0].count;
                if (count > 0) {
                    // Update existing record
                    const sql = "UPDATE settings SET ipaddr = ? WHERE userid = ?";
                    conn.query(sql, [ipaddr, userid], (error, results) => {
                        conn.end();
                        if (error) {
                            return callback(error, null);
                        } else {
                            return callback(null, results);
                        }
                    });
                } else {
                    // Insert new record
                    const sql = "INSERT INTO settings (userid, ipaddr) VALUES (?, ?)";
                    conn.query(sql, [userid, ipaddr], (error, results) => {
                        conn.end();
                        if (error) {
                            return callback(error, null);
                        } else {
                            return callback(null, results);
                        }
                    });
                }
            }
        });
    },

    getSettings: function (userid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = 'SELECT ipaddr FROM settings WHERE userid = ?';
                conn.query(sql,[userid], function (err, result) {
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

module.exports = setting;