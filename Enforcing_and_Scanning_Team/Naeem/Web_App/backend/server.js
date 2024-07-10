// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const os = require('os');
var express = require('express');
var serveStatic = require('serve-static');
var app = require('./controller/app.js');

var port = 3000;

app.use(serveStatic(__dirname + '/public')); 

var server = app.listen(port, function(){
    console.log('Backend server hosted at http://localhost:%s', port);
});
