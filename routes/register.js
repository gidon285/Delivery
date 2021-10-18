const express = require("express");
const router = express.Router();
const path = require('path');
const redis = require('redis');
var bodyParser = require('body-parser');
rejson = require('redis-rejson');

rejson(redis);
const client = redis.createClient(6379,'127.0.0.1');
module.exports = router;
router.use(express.static(path.join(__dirname,'public/css')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));



router.get('',async (req, res,next) => {
    res.render(path.join(__dirname,'..','/views/pages/register'),{temp:'ddsasada'});
});
function getUsers(){
    return new Promise((res,rej) =>{
        client.json_get(`users`, function (err, value) {
            if (err) rej(err);
            res(value)
        })
    });
}
function checkUser(){
    return new Promise((res,rej) =>{
        client.json_get(`current`, function (err, value) {
            if (err) rej(err);
            res(value)
        })
    });
}
function updateUsers(users){
    return new Promise((res,rej) =>{
        client.json_set(`users`,".", function (err, value) {
            if (err) rej(err);
            res(users)
        })
        client.json_set(`users`,".", users)
    });
}
router.post('/s', async(req, res) => {
    var _data = await getUsers();
    var _userdata = JSON.parse(_data);
    var asdf = await checkUser();
    console.log(asdf);
    console.log("ASDasd");
    var answer = {
        name: req.body.name,
        pass1: req.body.pass1,
        pass2: req.body.pass2
    }
    var response = {err:'',succ:""};
    if( answer.name === "" && answer.pass1 === "" && answer.pass2 === "" ){
        response.err= 'Please fill-out the form.';
        res.send(response);
        return;
    }
    if( answer.name === "" ){
        response.err= 'Please enter username';
        res.send(response);
        return;
    }else{
        for (var i = 0; i < _userdata.users.length; i++) {
            if(_userdata.users[i].username == answer.name){
                response.err= 'Username taken, Please choose a different username.';
                res.send(response);
                return;
            }
        }
    }
    if(  answer.pass1 !=  answer.pass2){
        response.err='Passwords doesn\'t match, Please retype.';
        res.send(response);
        return;
    }else if(  answer.pass1.length<6 ||answer.pass2.length<6  ){
        response.err='Password should be at least 6 digits.';
        res.send(response);
        return;
    }
    //------------------------------------//
    // var _nuser = {answer.name, password:answer.pass1};
    // _userdata.users.push(_nuser);
    // updateUsers(JSON.stringify(_userdata));
    response.succ='User created!';
    res.send(response);
    return;
});
    
