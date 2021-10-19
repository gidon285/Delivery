const { Cipher } = require("crypto");
const express = require("express");
const { type } = require("os");
const router = express.Router();
const path = require('path');
const redis = require('redis');
rejson = require('redis-rejson');
var bodyParser = require('body-parser');

rejson(redis);
const client = redis.createClient(6379,'127.0.0.1');
module.exports = router;
router.use(express.static(path.join(__dirname,'public/css')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.post('/login', async (req, res) => {
    var _data = await getUserData('users');
    var _userdata = JSON.parse(_data);
    var answer = {
        name: req.body.name,
        pass: req.body.pass
    }
    var response = {err:'',succ:""};
    if( answer.name === "" && answer.pass === ""){
        response.err= 'Please fill-out the form.';
        res.send(response);
        return;
    }
    for (var i = 0; i < _userdata.users.length; i++) {
        if((_userdata.users[i].username === answer.name)&&(_userdata.users[i].password === answer.pass )){
            response.succ= 'ok';
            res.send(response);
            return;
        }else if((_userdata.users[i].username === answer.name)&&(_userdata.users[i].password !== answer.pass )){
            response.err= 'Wroung password!';
            res.send(response);
            return;
        }else{
            response.err= 'Can\'t find user, Please Check again!';
            res.send(response);
            return;  
        }
    }
})
router.get('/dashboard',async (req,res)=>{
    console.log("dsa2213");
    res.render('./pages/dashboard');
});
router.get('/profile',async (req,res)=>{
    res.render('./pages/profie');
});
router.get('/help',async (req,res)=>{
    res.render('./pages/profie');
});
router.get('/map-google',async (req,res)=>{
    res.render('./pages/profie');
});
router.get('/deliveries',async (req,res)=>{
    res.render('./pages/profie');
});
router.get('/register', (req, res) => {
    res.render('/pages/register');
});
function getUserData(key){
    return new Promise((res,rej) =>{
        client.json_get(key, function (err, value) {
            if (err) rej(err);
            res(value)
        })
    });
}
