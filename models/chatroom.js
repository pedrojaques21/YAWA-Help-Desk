const mongoose = require('./mongooseConfigs').mongoose;

const chatroomSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: false
    }],
    active: {
      type: Boolean,
      default: 1
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);