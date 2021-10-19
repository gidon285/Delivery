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

router.get('/', async (req, res,next) => {
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
    next("username");
    // }
})
function next(){
    router.render("dashboard");
}
router.get('/register', (req, res) => {
    res.render('/pages/register',{temp:'aaa'});
});
function getUserData(key){
    return new Promise((res,rej) =>{
        client.json_get(key, function (err, value) {
            if (err) rej(err);
            res(value)
        })
    });
}
