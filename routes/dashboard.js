const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser =require('body-parser');
const redisComm = require('../Redis/redisCommunicate.js')


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/',async (req,res)=>{
    res.render('./pages/dashboard');
});
router.get('/profile',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/profile'));
});
router.get('/help',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/help'));
});
router.get('/getInfo',async (req,res)=>{
    var _data =  await redisComm.getData('users')
});
router.get('/map-google',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/map-google'));
});
router.get('/deliveries',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/deliveries'));
});
router.get('/analytical',async (req,res)=>{
    res.render(path.join(__dirname,'..','/views/pages/analytical'));
});
router.get('/register', (req, res) => {
    res.render('/pages/register');
});

module.exports = router;