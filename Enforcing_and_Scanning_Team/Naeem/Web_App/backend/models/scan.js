const user = {
    insertUser: function (filename, ip, createdAt,callback) {
        var dbConn = db.getConnection();
        // Select email, to check if email exists
        const sql ="INSERT INTO scans (filename, ip_address, created_at) VALUES (?, ?, ?)";
        dbConn.query(sql, [filename, ip, createdAt], (error, results) => {
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
      savePolicy: function (filename, ip, createdAt, callback) {

        var conn = db.getConnection();
        const sql ="INSERT INTO scans (scanned_filename, ip_address, created_at, lastscan_at) VALUES (?, ?, ?, ?)";
            conn.query(sql, [filename, ip, createdAt, createdAt], (error, results) => {
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
        savePolicy: function (filename, ip, createdAt, callback) {

            var conn = db.getConnection();
            const sql ="INSERT INTO scans (scanned_filename, ip_address, created_at, lastscan_at) VALUES (?, ?, ?, ?)";
                conn.query(sql, [filename, ip, createdAt, createdAt], (error, results) => {
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