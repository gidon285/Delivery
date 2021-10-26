const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser')
module.exports = router;
const redisComm = require('../Redis/redisCommunicate.js')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('',async (req, res) => {
    res.render(path.join(__dirname,'..','/views/pages/register'));
});

router.post('/s', async(req, res) => {
    var _data =  await redisComm.getData('users')
    var _userdata = JSON.parse(_data);
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
    if( answer.pass1 !=  answer.pass2){
        response.err='Passwords doesn\'t match, Please retype.';
        res.send(response);
        return;
    }else if(  answer.pass1.length<6 ||answer.pass2.length<6  ){
        response.err='Password should be at least 6 digits.';
        res.send(response);
        return;
    }
    //------------------------------------//
    var _nuser = {username:answer.name, password:answer.pass1};;
    _userdata.users.push(_nuser);
    redisComm.setData('users', _userdata);
    response.succ='User created!';
    res.send(response);
    return;
});
    
