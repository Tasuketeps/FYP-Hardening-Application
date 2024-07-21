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
