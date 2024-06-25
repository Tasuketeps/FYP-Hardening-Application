// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
var verifyToken = require('../auth/verifyToken.js');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const csv = require('csv');

app.options('*',cors());
app.use(cors());

const user = require("../models/user");
const scan = require("../models/scan");
const benchmark = require("../models/benchmark")
const baseline = require("../models/baseline")

// import body-parser middleware
const bodyParser = require("body-parser");

app.use(bodyParser.text({ type: 'text/csv' }));


// use the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login Endpoint 
app.post('/user/login',function(req, res){
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
// Register Endpoint
app.post('/user/register', function (req, res) {
    var { username, email, password } = req.body;
    var newUser = { username, email, password };
    user.insertUsers(newUser, function (err, result) {
        if (!err) {
            res.status(201).json({ message: "Registration successful!" });
        } else if (err.code === "ER_DUP_ENTRY") {
            res.status(422).json({ message: "Username or Email already exists!" });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    });
});


// Scanning script endpoint based on 
app.get('/execute-secedit', (req, res) => {
    exec('sh ../scripts/automate_process.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            res.status(500).send('Error executing script: ' + error.message);
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            res.status(500).send('Script execution error: ' + stderr);
            return;
        }
        console.log(`Script stdout: ${stdout}`);
        res.send(`Script executed successfully: ${stdout}`);
    });
});

// Scan for connected devices to the domain network endpoint
app.get('/scan', (req, res) => {
    exec('expect scripts/arp_scan.sh', (error, stdout, stderr) => {
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
        res.send(`${stdout}`);
    });
});

// Scan system information based on ip address
app.get('/scanInfo', (req, res) => {
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
app.get('/policy-scan', (req, res) => {
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
app.get("/checkPolicy", (req, res, next) => {
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
app.get("/getPolicy", (req, res, next) => {
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
app.get("/openPolicy", (req, res, next) => {
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
//    fs.readFile(filePath, 'utf8', (err, data) => {
//      if (err) {
//        console.log(`Error reading file ${filePath}:`, err);
//        res.status(500).send('Error reading file');
//        return;
//      }

//      res.status(200).send(data);
//    });
    //res.status(201).send(results);
  });
})

app.use(fileUpload());
// Draft CIS Benchmark uploader endpoint
app.post("/uploadBenchmark", (req, res) => {
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

app.get("/allBenchmarks", (req, res, next) => {
    benchmark.findAllBenchmarks((error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send();
      };
      res.status(200).json(results);
    });
  });

app.get("/benchmark", (req, res, next) => {
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

app.post('/baseline', (req, res) => {
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



app.get("/allBaseline", (req, res, next) => {
    baseline.getAllBaseline((error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send();
      };
      res.status(200).json(results);
    });
  });

app.get("/baseline", (req, res, next) => {
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


















module.exports = app
