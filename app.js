const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('public'));
app.set('view engine','ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/login.html'));
})
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/dashboard.html'));
})
// app.get('/getTable', (req, res) => {
//   var data = {size:parseInt(req.query.mSize)};
//   res.render('pages/table',data);
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})