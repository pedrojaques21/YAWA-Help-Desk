const express = require('express')
const router = express.Router()
const Ticket = require('../models/ticket')

//All Tickets Route
router.get('/', async (req,res) =>{
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const tickets = await Ticket.find(searchOptions)
        res.render('tickets/all', {
            tickets: tickets,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ticket Route
router.get('/new', (req, res) => {
    res.render('tickets/new', { ticket: new Ticket()})
})

//Create Ticket Route
router.post('/', async (req, res) => {
    const ticket = new Ticket({
        topic: req.body.topic,
        name: req.body.name,
        phone_number: req.body.phone_number,
        e_mail: req.body.e_mail,
        message: req.body.message
    })
    try {
        const newTicket = await ticket.save()
        //res.redirect('tickets/${newTicket.id}')
        res.redirect('tickets')
    } catch {
        res.render('tickets/new', {
            ticket: ticket,
            errorMessage: 'Error creating ticket'
        })
    }
})

module.exports = router




