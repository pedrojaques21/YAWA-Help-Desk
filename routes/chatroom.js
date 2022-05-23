const express = require('express');
const { route } = require('.');
const chatroom = require('../models/chatroom');
const router = express.Router();
const Chatroom = require('../models/chatroom')
const Message = require('../models/message')

router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i')
  }
  try {
    const chatrooms = await Chatroom.find(searchOptions)
    res.render('chatroom/index', { 
      chatrooms: chatrooms, 
      searchOptions: req.query })
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

// router.post('/livechat', async (req, res) => {
//   const message = new Message({
//     author: 'User Test',
//     message: req.body.message
//   })
//   try {
//     const newMessage = await message.save()
//   } catch (err) {
//     console.log(err)
//   }
// })
module.exports = router;