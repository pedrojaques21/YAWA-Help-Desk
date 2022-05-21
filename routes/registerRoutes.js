const express = require('express');

const userController = require('../controllers/userController');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/register')
});

router.post('/', jsonParser, (req, res) => {
  userController.insert(req, res);
  res.redirect('/chatroom')
});

module.exports = router;