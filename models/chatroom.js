const mongoose = require('./mongooseConfigs').mongoose;
const Schema = mongoose.Schema;

const chatroomSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    messages: {
      type: Schema.Types.ObjectId,
      ref: 'message',
      required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);