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

function getUserData(key){
    return new Promise((res,rej) =>{
        client.json_get(key, function (err, value) {
            if (err) rej(err);
            res(value)
        })
    });
}
async function isRegistered(user,pass){
    var _data = await getUserData('users');
    var _userdata = JSON.parse(_data);
    for (var i = 0; i < _userdata.users.length; i++) {
        if((_userdata.users[i].username == user)&&(_userdata.users[i].password == pass )){
            
        }
        
    }
}
router.get('/', async (req, res) => {
    let ans = await isRegistered(req.query.user,req.query.pass);
    
})

router.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname,'..','/public/register.html'));
})











// <!-- <form method="GET" class="inputdiv" action="http://localhost:3000/dashboard">
//   <label>Username : </label>   
//   <input type="text"  placeholder="Enter Username" name="username" required>  
//   <label>Password : </label>   
//   <input type="password" placeholder="Enter Password" name="password" required>  
  
//   <input type="checkbox" checked="checked"> Remember me   
//   <button type="button" class="cancelbtn"> Cancel</button>   
//   Forgot <a href="#"> password? </a>   
// </form>    
//  <a class="oauth-container btn darken-4 white black-text" href="/users/google-oauth/" style="text-transform:none">
//   <div class="left" alt="Google sign-in">
//     <img class="glogin" alt="Google sign-in" 
//     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
//   </div>
//   Login with Google
// </a>
// input[type=text], input[type=password] { 
//     width: 200px; 
//     margin: 8px 0;
//     padding: 12px 20px; 
//     display: inline-block; 
//     border: 2px solid green; 
//     box-sizing: border-box; 
// } 
// .glogin{
//     margin-top:7px;
//     margin-right:8px;
//     width : 20px;
//     background-image: url()
// }
// .inputdiv{
//     width: 400px;
// } -->
