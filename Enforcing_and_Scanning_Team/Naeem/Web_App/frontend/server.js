var express=require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');
var hostname="192.168.126.148";
var port=3001;

var app=express();

const options = {
        key: fs.readFileSync(path.join(__dirname,'/cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'/cert/cert.pem'))
}


app.use(function(req,res,next){
    const {method , url} = req;
    console.log(`Received Method = ${method} Url = ${url}`);    next();
});


app.use(express.static(__dirname+"/public"));


const httpsServer = https.createServer(options, app);
httpsServer.listen(port);