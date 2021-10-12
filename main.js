const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const loginrouter = require(__dirname+'/routes/login.js');


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/login',loginrouter);

app.get('', (req, res) => {
   res.sendFile(path.join(__dirname + '/public/index.html'));
   
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})