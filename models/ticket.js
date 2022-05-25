const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: false
    },
    e_mail: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ticket', ticketSchema)




