const express = require('express');
const router = express.Router();
const Chatroom = require('../models/chatroom')

router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i')
  }
  try {
    const chatrooms = await Chatroom.find(searchOptions)
    res.render('chatroom/index', { 
      chatrooms: chatrooms, 
      searchOptions: req.query
    })
  } catch (err) {
    res.redirect('/')
  }
  
});

router.get('/new', (req, res) => {
  res.render('chatroom/new', { chatroom: new Chatroom() })
});

router.get('/:room', async (req, res) => {
  if ( await Chatroom.findOne({ title: req.params.room }) == null) {
    return res.redirect('/chatroom')
  }
  res.render('chatroom/chatroom', {
    chatroomTitle: req.params.room
  })
});

router.post('/', async (req, res) => {
  if ( await Chatroom.findOne({ title: req.body.title }) != null) {
    return res.redirect('/chatroom')
  }
  const chatroom = new Chatroom({
    title: req.body.title
  })
  try {
    const newChatroom = await chatroom.save()
    res.redirect('chatroom/' + req.body.title)
  } catch (err) {
    res.render('chatroom/new', { 
        chatroom: chatroom,
        errorMessage: 'Error creating Chatroom.'
    })
    console.log(err)
  }
})

module.exports = router;