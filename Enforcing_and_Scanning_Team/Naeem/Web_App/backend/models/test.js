var bcrypt = require('bcrypt');
password = 'Password123!'
bcrypt.hash(password, 10, function (err, hashPassword) {
    if (err) {
      console.log("Error hashing password:", err);
      
    }
    else {
        console.log(hashPassword)
    }
  });
