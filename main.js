const express = require('express');
const path = require('path');
const Redis = require('redis');
const app = express();
const port = 3000;
var num_of_users =0
const redis = Redis.createClient(6379,'127.0.0.1');

app.use(express.static('public'));

app.get('/enter', (req, res) => {
  var data2 = {user:req.query.user, pass:req.query.pass}
  // if(redis.HKEYS(data2.user) == 0){
  //   console.log("true")
  // }else {
  //   console.log("false")// not found.
  // }
})
app.get('/dashboard', (req, res) => {
   res.sendFile(path.join(__dirname + '/public/dashboard.html'));
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})