const express = require('express');
const router = express.Router();
const passport = require('passport');

//Passport Initialization
const User = require('../models/user')
const initializePassport = require('../passport-config');
initializePassport(
  passport,
  username => User.findOne({ username: username }),
  id => User.findById({ id: id })
);

router.get('/', (req, res) => {
  res.render('login')
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login', 
  failureFlash: true
}));

module.exports = router;