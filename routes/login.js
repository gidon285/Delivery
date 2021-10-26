const express = require("express");
const router = express.Router();
const path = require('path');
const redisComm = require('../Redis/redisCommunicate.js')
const bodyParser =require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.post('/', async (req, res) => {
    var _data = await redisComm.getData('users')
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
            var scurrent = await redisComm.getData('current')
            var current = JSON.parse(scurrent);
            current.user = "admin";
            redisComm.setData('current',current);
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
module.exports = router;