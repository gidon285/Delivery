const express = require('express');
const exp = require('express')();
const server = require('http').Server(exp);
const redis = require('redis');
const port = 3001;
const publisher = redis.createClient();

function passPack(channel,pack){
    publisher.publish(channel,pack,()=>{
        console.log('A package was sent.')
    })
}
publisher.on('connect', function () {
    console.log('Redis broker-Sender is now initialized');
});
server.listen(port, function () {
});

module.exports ={passPack};