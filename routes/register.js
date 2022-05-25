const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/', (req, res) => {
  res.render('register')
});

router.post('/', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword    
  })
  try {
    const newUser = await user.save()
    res.redirect('/login')
  } catch (err) {
    res.render('register', { 
        user: user,
        errorMessage: 'Error creating User.'
    })
    console.log(err)
  }
})

module.exports = router;