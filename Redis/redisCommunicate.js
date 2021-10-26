var express = require('express');
var app = require('express');
var redis = require('redis');
rejson = require('redis-rejson');
rejson(redis);
const client = redis.createClient(6379,'127.0.0.1');

function getData(key){
    return new Promise((res,rej) =>{
        client.json_get(key, (err,value)=> {
            if (err) rej(err);
            res(value)
        })
    });
}
function setData(key,value){
    var input = JSON.stringify(value);
    return new Promise((res,rej) =>{
        client.json_set(key,".",input);
    }).catch((err)=>console.log(err))
}
function delData(key){
    return new Promise((res,rej) =>{
        client.json_del(key);
    }).catch((err)=>console.log(err))
}
module.exports={getData,setData,delData};