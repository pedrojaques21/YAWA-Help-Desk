const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (req, res) => {
  res.render("pages/index");
});

var server = app.listen(port, function () {
    console.log(`Application is running at: http://localhost:${port}`);
});