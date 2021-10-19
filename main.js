const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const dashrouter = require(__dirname+'/routes/dash.js');
const registerrouter = require(__dirname+'/routes/register.js');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/dashboard',dashrouter);
app.use('/register',registerrouter);

app.get('', (req, res) => {
    res.render(path.join(__dirname+ '/views/pages/login'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})