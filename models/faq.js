const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Faq', faqSchema)
