const express = require('express');
const exp = require('express')();
const server = require('http').Server(exp);
const redis = require('redis');
const port = 3001;
const publisher = redis.createClient();

function passPack(channel,pack){
    if(channel ==="qr"){
        publisher.publish(channel,pack,(err)=>{
            if(err)console.log(err);
        })
        console.log("qr arrived!");
    }
    else{
        publisher.publish(channel,pack,(err)=>{
            if(err)console.log(err);
        })
        console.log("package arrived!");
    }
}
publisher.on('connect', function () {
    console.log('Redis broker-Sender is now initialized');
});
server.listen(port, function () {
});

module.exports ={passPack};