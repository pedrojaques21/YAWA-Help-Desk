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
        res.redirect(`tickets/${newTicket.id}`)
    } catch {
        res.render('tickets/new', {
            ticket: ticket,
            errorMessage: 'Error creating ticket'
        })
    }
})

router.get('/:id', async (req,res) => {
    let ticket
    try {
        ticket = await Ticket.findById(req.params.id)
        res.render('tickets/view', {
            ticket: ticket
        })
    } catch {
        if(ticket == null) {
            res.redirect('/')
        } else {
            res.render('tickets/edit', {
                ticket: ticket,
                errorMessage: 'Error updating ticket'
            })
        }
    }
})

router.get('/:id/edit', async (req,res) => {

    try {
        const ticket = await Ticket.findById(req.params.id)
        res.render('tickets/edit', { ticket: ticket})
    } catch {
        res.redirect('/tickets')
    }
})

router.put('/:id', async (req,res) => {
    let ticket
    try {
        ticket = await Ticket.findById(req.params.id)
        ticket.topic = req.body.topic
        ticket.name = req.body.name
        ticket.phone_number = req.body.phone_number
        ticket.e_mail = req.body.e_mail
        ticket.message = req.body.message
        await ticket.save()
        res.redirect(`/tickets/${ticket.id}`)
    } catch {
        if(ticket == null) {
            res.redirect('/')
        } else {
            res.render('tickets/edit', {
                ticket: ticket,
                errorMessage: 'Error updating ticket'
            })
        }
    }
})

router.delete('/:id', async (req,res) => {
    let ticket
    try {
        ticket = await Ticket.findById(req.params.id)
        await ticket.remove()
        res.redirect('/tickets')
    } catch {
        if(ticket == null) {
            res.redirect('/')
        } else {
            res.redirect(`/tickets/${ticket.id}`)
        }
    }
})



module.exports = router


