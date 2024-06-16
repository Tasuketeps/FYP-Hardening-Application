// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
var verifyToken = require('../auth/verifyToken.js');
const cors = require('cors');
const { exec } = require('child_process');

app.options('*',cors());
app.use(cors());

const user = require("../models/user");
const scan = require("../models/scan");

// import body-parser middleware
const bodyParser = require("body-parser");

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


app.get('/execute-secedit', (req, res) => {
    exec('sh ./automate_process.sh', (error, stdout, stderr) => {
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

app.get('/scan', (req, res) => {
    exec('expect controller/arp_scan.sh', (error, stdout, stderr) => {
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

app.get('/scanInfo', (req, res) => {
    const ipaddr = req.query.ipaddr
    exec('sh controller/scanInfo.sh ' + ipaddr, (error, stdout, stderr) => {
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

app.get('/policy-scan', (req, res) => {
    const ipaddr = req.query.ipaddr
    exec('sh controller/automate_process.sh ' + ipaddr, (error, stdout, stderr) => {
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
    res.status(200).send(createdAt);
return;
  });
	//res.send(`${stdout}`);
    });
});



module.exports = app
