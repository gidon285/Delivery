const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const loginrouter = require(__dirname+'/routes/login.js');
const registerrouter = require(__dirname+'/routes/register.js');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/login',loginrouter);
app.use('/register',registerrouter);

app.get('', (req, res) => {
    res.render(path.join(__dirname+ '/views/pages/login'),{temp:'aaa'})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})