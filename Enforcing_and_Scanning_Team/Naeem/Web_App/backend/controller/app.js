// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
var verifyToken = require('../auth/verifyToken.js');
const cors = require('cors');

app.options('*',cors());
app.use(cors());

const user = require("../models/user");

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

app.post('/user/logout', function(req,res){
	console.log("..logging out.");
	//res.clearCookie('session-id'); //clears the cookie in the response
	//res.setHeader('Content-Type', 'application/json');
  	res.json({success: true, status: 'Log out successful!'});

});


module.exports = app