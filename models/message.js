const mongoose = require('./mongooseConfigs').mongoose;
const Schema = mongoose.Schema;

//Our message schema
const messageSchema = new mongoose.Schema({
    author: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//Create the actual model
module.exports = mongoose.model('Message', messageSchema);
