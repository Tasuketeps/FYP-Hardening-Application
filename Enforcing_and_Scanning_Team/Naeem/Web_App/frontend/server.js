const express=require('express');

var hostname="localhost";
var port=3001;

var app=express();


app.use(function(req,res,next){
    const {method , url} = req;
    console.log(`Received Method = ${method} Url = ${url}`);
    next();
});

app.use(express.static(__dirname+"/public"));


app.listen(port,hostname,function(){
    console.log(`Frontend Server hosted at http://${hostname}:${port}`);
});