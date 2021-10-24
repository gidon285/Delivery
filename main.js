const express = require('express');
const app = express();
const path = require('path');
const dashboard = require(__dirname+'/routes/dashboard.js');
const login = require(__dirname+'/routes/login.js');
const register = require(__dirname+'/routes/register.js');
const generator = require('./generator.js');
const firebase = require('./Firebase/firebase.js')
const port = 3000;

app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine', 'ejs');

app.use('/login',login);
app.use('/dashboard',dashboard);
app.use('/register',register);

app.get('', (req, res) => {
    res.render(path.join(__dirname+ '/views/pages/login'))
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
