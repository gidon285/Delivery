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

router.get('/', async (req, res) => {
    var _data = await getUserData('users');
    var _userdata = JSON.parse(_data);
    for (var i = 0; i < _userdata.users.length; i++) {
        if((_userdata.users[i].username == req.query.user)&&(_userdata.users[i].password == req.query.pass )){
            var place =(path.join(__dirname,'..','/views/pages/table'));
            var user = {name:_userdata.users[i].username};
            console.log("ok");
            // res.render(place, user);
        }else if((_userdata.users[i].username == req.query.user)&&(_userdata.users[i].password != req.query.pass )){
            console.log("worng password");
        }else {
            console.log("cant find user");
        }

    }
})
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