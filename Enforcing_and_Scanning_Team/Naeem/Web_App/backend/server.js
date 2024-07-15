// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
var app = require('./controller/app')
var fs = require('fs');
var https = require('https');
var path = require('path');
var hostname="192.168.126.148";
var port=3000;

const options = {
        key: fs.readFileSync(path.join(__dirname,'/cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'/cert/cert.pem'))
}


const httpsServer = https.createServer(options, app);
httpsServer.listen(port);