const express = require('express');
const router = express.Router();
const Chatroom = require('../models/chatroom')

router.get('/', async (req, res) => {
  try {
    const chatrooms = await Chatroom.find({})
    res.render('chatroom/index', { chatrooms : chatrooms })
  } catch (err) {
    res.redirect('/')
  }
  
});

router.get('/new', (req, res) => {
  res.render('chatroom/new', { chatroom: new Chatroom() })
});

router.get('/livechat', (req, res) => {
  res.render('chatroom/chatroom')
});

router.post('/', async (req, res) => {
  const chatroom = new Chatroom({
    title: req.body.title
  })
  try {
    const newChatroom = await chatroom.save()
    res.redirect('chatroom/livechat')
  } catch (err) {
    res.render('chatroom/new', { 
        chatroom: chatroom,
        errorMessage: 'Error creating Chatroom.'
    })
    console.log(err)
  }
})

module.exports = router;