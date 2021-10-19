const { Cipher } = require("crypto");
const express = require("express");
const { type } = require("os");
const router = express.Router();
const path = require('path');
const redis = require('redis');
rejson = require('redis-rejson');

rejson(redis);
const client = redis.createClient(6379,'127.0.0.1');
module.exports = router;
router.use(express.static(path.join(__dirname,'public/css')));

router.post('/login', async (req, res) => {
    console.log("#4224");
    res.set("Connection", "close");
    res.send("ads");
    // var _data = await getUserData('users');
    // var _userdata = JSON.parse(_data);
    // var answer = {
    //     name: req.body.name,
    //     pass1: req.body.pass1,
    //     pass2: req.body.pass2
    // }
    // var response = {err:'',succ:""};
    // for (var i = 0; i < _userdata.users.length; i++) {
    //     if((_userdata.users[i].username == req.query.user)&&(_userdata.users[i].password == req.query.pass )){
    //         // var place =(path.join(__dirname,'..','/views/pages/table'));
    //         // var user = {name:_userdata.users[i].username};
    //         // res.render(place, user);
    //         console.log("asdads")
    //     }else if((_userdata.users[i].username == req.query.user)&&(_userdata.users[i].password != req.query.pass )){
    //         console.log("worng password");
    //     }else {
    //         console.log("cant find user");
    //     }
    // }
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
