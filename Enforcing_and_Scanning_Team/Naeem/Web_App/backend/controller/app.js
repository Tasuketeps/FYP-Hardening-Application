// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
var verifyToken = require('../auth/verifyToken.js');
const cors = require('cors');
const { exec } = require('child_process');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const csv = require('csv');
const axios = require('axios');
app.options('*',cors());
app.use(cors());

const user = require("../models/user");
const scan = require("../models/scan");
const benchmark = require("../models/benchmark")
const baseline = require("../models/baseline")
const logger = require("../scripts/logger")
const setting = require("../models/settings");
// import body-parser middleware
const bodyParser = require("body-parser");

app.use(bodyParser.text({ type: 'text/csv' }));


// use the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Original Login Endpoint without recaptcha
app.post('/user/loginOriginal',function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  user.loginUser(username, password, function(err, token, result){
      if(!err){
    res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      delete result[0]['password'];//clear the password in json data, do not send back to client
      console.log(result);
    res.json({success: true, UserData: JSON.stringify(result), token:token, status: 'You are successfully logged in!'}); 
    res.send();
  }else{
          res.status(500);
          res.send(err);
      }
  }); 
});

// new login endpoint with recaptcha
app.post('/user/login', async (req, res) => {
    const secretKey = '6LeXsRIqAAAAAN313r0BJx4lMOLdvK926Ny1hUDC';
    const userKey = req.body.captchaToken;
    console.log(userKey);
    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${userKey}`;
        const { data } = await axios.post(verificationURL);
        if (data.success) {
            // reCAPTCHA verification successful
            const { username, password } = req.body;
            user.loginUser(username, password, function (err, token, result) {
                if (!err) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    delete result[0]['password'];//clear the password in json data, do not send back to client
                    console.log(result[0].username + " logged in");
                    res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
                } else {
                    res.status(500);
                    res.send("Error Code: " + err.statusCode);
                }
            });
        } else {
            // reCAPTCHA verification failed
            res.status(500).send('reCAPTCHA verification failed!')
        }
    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});
// endpoint to verify a user's type
app.post('/verifyUser', verifyToken, function (req, res) {
    if (req.type === 'admin') {
        res.status(200).json({ type: 'admin' }); // Admin role
    } else if (req.type === 'user') {
        res.status(200).json({ type: 'user' }); // Regular user role
    } else {
        res.sendStatus(403);
    }
});


// Register Endpoint
app.post('/user/register', verifyToken, function (req, res) {
    if (req.type != 'admin') {
	return res.status(403).json({auth: 'false', message: 'Not authorized!'});
}    
    var { username, email, password } = req.body;

    // Email validation pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password complexity validation pattern
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        // Validate email format
    if (!emailPattern.test(email)) {
        return res.status(400).json({ field: "email", message: "Invalid Email Format" });
    }

    // Validate password complexity
    if (!passwordPattern.test(password)) {
        return res.status(400).json({ field: "password", message: "Password must be 8 or more characters long, and include at least one number, one special character, one uppercase and one lowercase letter" });
    }
    var newUser = { username, email, password };
    user.insertUsers(newUser, function (err, result) {
        if (!err) {
	    logger.info(`Create new user, User: ${username}, Email: ${email}`);
            res.status(201).json({ message: "Registration successful!" });
        } else {
            console.error("Error inserting user:", err);
            if (err.code === "ER_DUP_ENTRY") {
		logger.error(`${err.code} to create new user, User: ${username}, Email: ${email}`)
                res.status(422).json({ field: "username", message: "Username or Email already exists!" });
            } else {
		logger.error(`Unknown error to create new user, User: ${username}, Email: ${email}`)
                res.status(500).json({ message: "Server error" });
            }
        }
    });
});

// Change password endpoint

app.post('/user/updateUserPassword', verifyToken, (req, res) => {
    const { currentPassword, newPassword, repeatPassword } = req.body;
    const userid = req.userid;

    console.log(userid)

    if (!userid) {
        return res.status(403).json({ error: 'User not authenticated.' });
    }

    user.updateUser(currentPassword, newPassword, repeatPassword, userid, function(err, result) {
        if (err) {
	    logger.error(`User with userid: ${userid} FAILED to change password.`)
            console.error('Failed to update password:', err.message);
            return res.status(500).json({ error: err.message });
        } else {
	    logger.info(`User with userid: ${userid} changed password.`)
            console.log('Password updated successfully.');
            return res.status(200).json({ message: 'Password updated successfully.' });
        }
    });
});
// endpoint to get a user's details for settings page
app.get('/user',verifyToken, function (req, res) {
    const userid = req.userid;

    if (!userid) {
        return res.status(403).json({ error: 'User not authenticated.' });
    }

    user.getUser(userid, function(err, result) {
        if (err) {
            
            return res.status(500).json({ error: err.message });
        } else {
            
            return res.status(200).json(result);
        }
    });
});


// Scan for connected devices on the network endpoint, for this to work the server hosting the web needs to have
// arp-scan installed and removing the need of sudo privileges to run the arp-scan command
app.get('/scan', verifyToken,(req, res) => {
    ipaddr = req.query.ipaddr;
    execFile('/usr/sbin/arp-scan', [ipaddr], (error, stdout, stderr) => {
        if (error) {
        //    console.error(`Error executing script: ${error}`);
            res.status(500).send('Error executing script: ' + error + __dirname);
            return;
        }
        if (stderr) {
        //    console.error(`Script stderr: ${stderr}`);
            res.status(500).send('Script execution error: ' + stderr);
            return;
        }
        //console.log(`Script stdout: ${stdout}`);
        res.send(`${stdout}`);
    });
});

// Scan system information based on ip address
app.get('/scanInfo', verifyToken, (req, res) => {
    const ipaddr = req.query.ipaddr
    exec('sh scripts/scanInfo.sh ' + ipaddr, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            res.status(500).send('Error executing script: ' + error + __dirname);
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            res.status(500).send('Script execution error: ' + stderr);
            return;
        }
        console.log(`Script stdout: ${stdout}`);
	res.send(`${stdout}`)
    });
});

// Scans for policies based on ip address endpoint
app.get('/policy-scan', verifyToken,(req, res) => {
    const ipaddr = req.query.ipaddr
    exec('sh scripts/automate_process.sh ' + ipaddr, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            res.status(500).send('Error executing script: ' + error + __dirname);
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            res.status(500).send('Script execution error: ' + stderr);
            return;
        }
	// Extract filename from stdout
        const filenameMatch = stdout.match(/Transferring file to the web server\.\.\.\n(\S+)/);
        const filename = filenameMatch ? filenameMatch[1] : 'unknown';
        // Extract the datetime from the filename (assuming the filename format is consistent)
        const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})/);
        const createdAt = dateMatch ? dateMatch[1].replace(/_/g, ' ').replace(/-/g, ':').replace(' ', 'T') + 'Z' : new Date().toISOString();
        scan.savePolicy(filename,ipaddr,createdAt,createdAt,(error, result) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    const filePath = path.join(__dirname, '../scans/inf', filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(404).send('File not found');
                return;
            }

            // Run the Python script to convert the .inf file
            const pythonScript = path.join(__dirname, '../scripts/converter.py');
            const command = `python3 ${pythonScript} ${filePath} scans/csv/${filename}.csv`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
                // res.status(200).send(stdout);
            });
        });
    result['createdAt'] = createdAt;
    res.status(200).send(result);
return;
  });
	//res.send(`${stdout}`);
    });
});

// Checks scan file existence endpoint
app.get("/checkPolicy", verifyToken,(req, res, next) => {
    const ipaddr = req.query.ipaddr
    scan.checkScan(ipaddr,(error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      };
      if (results.length === 0){
	res.status(404).send("Never scanned");
}
      res.status(200).send(results);
    });
  });

// Get scan file endpoint
app.get("/getPolicy", verifyToken,(req, res, next) => {
    const scanid = req.query.scanid
    scan.findFilename(scanid,(error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      };
	const fileName = results[0].scanned_filename
	const filePath = path.join(__dirname, '../scans/inf', fileName);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(404).send('File not found');
                return;
            }

            // Run the Python script to convert the .inf file
            const pythonScript = path.join(__dirname, '../scripts/converter.py');
            const command = `python3 ${pythonScript} ${filePath} scans/csv/${fileName}.csv`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
                res.status(200).send(stdout);
            });
        });
      // res.status(200).send(results[0].scanned_filename);
    });
  });


// Gets policy endpoint
app.get("/openPolicy", verifyToken,(req, res, next) => {
  const scanid = req.query.scanid
  scan.getPolicyName(scanid,(error, results) => {
    if (error) {
      if (error.statusCode === 422) {
        res.status(422).send();
      } else {
        console.log(error)
        res.status(500).send();
      }
      return;
    }
    const filename = String(results[0].scanned_filename)+'.csv';
    const filepath = path.join(__dirname, '../scans/csv');
    const pythonScript = path.join(__dirname, '../scripts/displayingPolicies.py');
            const command = `python3 ${pythonScript} ${filepath}/${filename} ${filepath}/policy_reference.csv`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
                res.status(200).send(stdout);
            });
  });
})

app.use(fileUpload());
// Draft CIS Benchmark uploader endpoint
app.post("/uploadBenchmark", verifyToken,(req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Access the file
  const pdfFile = req.files.pdf_file;
  const uploadPath = path.join(__dirname, '../benchmarks/pdf', pdfFile.name);

  // Move the file to the uploads directory
  pdfFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
            const pythonScript = path.join(__dirname, '../scripts/newScraper.py');
            const command = `python3 ${pythonScript} benchmarks/pdf/${pdfFile.name}`;
	    filename = `${pdfFile.name}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
		    benchmark.insertBenchmark(filename,stdout.trim(), function (err, result) {
        if (!err) {
            res.status(201).json({ message: "Benchmark uploaded." });
        } else if (err.code === "ER_DUP_ENTRY") {
            res.status(422).json({ message: "Username or Email already exists!" });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    });

                // res.status(200).send(stdout);
            });
  });
});
// gets all benchmarks
app.get("/allBenchmarks", verifyToken,(req, res, next) => {
    benchmark.findAllBenchmarks((error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send();
      };
      res.status(200).json(results);
    });
  });

// gets a single benchmark
app.get("/benchmark", verifyToken,(req, res, next) => {
const filename = req.query.filename;

  if (!filename) {
    return res.status(400).send('Filename is required');
  }

  const filePath = path.join(__dirname, '../benchmarks/csv', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return res.status(500).send('Error reading file');
    }

    res.status(200).send(data);
  });    
  });
// uploads baseline endpoint
app.post('/baseline', verifyToken,(req, res) => {
    const csvData = req.body;
    const baselineName = req.headers['baseline-name'];

    console.log('Received CSV data:', csvData); // Log the received CSV data for debugging

    // Parse the CSV data using the `csv` module
    csv.parse(csvData, { columns: true, trim: true}, (err, records) => {
        if (err) {
            console.error('Error parsing CSV:', err); // Log the error details
            return res.status(400).json({ error: 'Invalid CSV data', details: err.message });
        }

        // Log the parsed records for debugging
        console.log('Parsed records:', records);

        // Define the file path and name
        const filePath = path.join(__dirname,'../baselines',`${baselineName}.csv`);

        // Save the CSV data to a file
        fs.writeFile(filePath, csvData, (err) => {
            if (err) {
                console.error('Error saving CSV data:', err); // Log the error details
                return res.status(500).json({ error: 'Failed to save CSV data', details: err.message });
            }
		baseline.insertBaseline(baselineName+'.csv',function (err, result) {
        if (!err) {
            res.status(201).json({ message: "Saved baseline." });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    });
            res.status(200).json({ message: 'CSV data received and saved successfully' });
        });
    });
});

// gets all baselines endpoint

app.get("/allBaseline", verifyToken,(req, res, next) => {
    baseline.getAllBaseline((error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send();
      };
      res.status(200).json(results);
    });
  });


// endpoint to display the comparison between current values and recommended values 
app.get("/baseline", verifyToken, (req, res, next) => {
    filename = req.query.filename;
    policyFileName = req.query.policyFileName;
    baseline.getBaseline(filename,(error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send();
      };
    const baselinePath = path.join(__dirname, '../baselines');
    const refPath = path.join(__dirname, '../scripts');
    const scanPath = path.join(__dirname,'../scans/csv')
    const pythonScript = path.join(__dirname, '../scripts/comparison.py');
            const command = `python3 ${pythonScript} ${scanPath}/${policyFileName} ${baselinePath}/${filename} ${refPath}/policy_reference.csv`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
                res.status(200).send(stdout);
            });      

    });
  });

// enforcing endpoint
app.post('/updatedPolicy', verifyToken, (req, res) => {
    
    var userid = req.userid;
	
    const csvData = req.body;
    const fileName = req.headers['file-name'];
    const ipaddr = req.headers['ip-address'];
    // Parse the CSV data using the `csv` module
    csv.parse(csvData, { columns: true, trim: true }, (err, records) => {
        if (err) {
            console.error('Error parsing CSV:', err); // Log the error details
            return res.status(400).json({ error: 'Invalid CSV data', details: err.message });
        }

        // Convert the records back to CSV format
        csv.stringify(records, { header: true }, (err, output) => {
            if (err) {
                console.error('Error stringifying CSV:', err); // Log the error details
                return res.status(500).json({ error: 'Error stringifying CSV data', details: err.message });
            }
            const filePath = path.join(__dirname,'../config','tempConfig.csv');
            // Write the CSV data to a file
            fs.writeFile(filePath, output, (err) => {
                if (err) {
                    console.error('Error writing CSV to file:', err); // Log the error details
                    return res.status(500).json({ error: 'Error writing CSV to file', details: err.message });
                }

                //res.status(200).json({ message: 'CSV data successfully written to file' });
            });
        });
    });
	// Initiate modifications	
	const pythonScript = path.join(__dirname, '../scripts/enforcer.py');
	var command = `python3 ${pythonScript} scans/inf/${fileName} config/tempConfig.csv`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing script: ${error}`);
                    res.status(500).send(`Error executing script: ${error}`);
                    return;
                }
                if (stderr) {
                    console.error(`Script stderr: ${stderr}`);
                    res.status(500).send(`Script error: ${stderr}`);
                    return;
                }

                // Send the output of the Python script as the response
                //res.status(200).send(stdout);
            });

	// Initiate the remote enforcing scripts
    const scriptsPath = path.join(__dirname, '../scripts');
//    const scanPath = path.join(__dirname,'../scans/inf')
	var command = `sh ${scriptsPath}/automate_enforcing.sh ${ipaddr} ${fileName}`;
	    exec(command, (error, stdout, stderr) => {
        if (error) {
            logger.error(`User with userid: ${userid} FAILED enforcing on ${ipaddr}`);
            console.error(`Error executing script: ${error}`);
            res.status(500).send('Error executing script: ' + error.message);
            return;
        }
        if (stderr) {
	    logger.error(`User with userid: ${userid} FAILED enforcing on ${ipaddr}`);
            console.error(`Script stderr: ${stderr}`);
            res.status(500).send('Script execution error: ' + stderr);
            return;
        }
        // console.log(`Script stdout: ${stdout}`);
	logger.info(`User with userid: ${userid} performed enforcing on ${ipaddr}`);
        res.status(200).send(`Script executed successfully: ${stdout}`);
    });	

});

app.put('/setting', verifyToken, (req, res) => {
    const userid = req.userid;
    const ipaddr = req.body.ipaddr;
    setting.updateSettings(userid, ipaddr, (err, result) => {
        if (!err) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.sendStatus(500);
        }
    });
});

app.get('/getSetting', verifyToken, (req, res) => {
    const userid = req.userid;
    setting.getSettings(userid, (err, result) => {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.sendStatus(500);
        }
    });
});




module.exports = app
