const mongoose = require('./mongooseConfigs').mongoose;
const Schema = mongoose.Schema;

//Our message schema
const messageSchema = new mongoose.Schema({
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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
const Message = mongoose.model('messages', messageSchema);

exports.findById = (id, cb) => {
  Message.findById(id, { _id:0, author:1, messageSchema:1})
      .populate({ path: 'author', model: user })
      .exec()
      .catch(err => cb(null, err));
};

exports.createMessage = (messageData, cb) => {

  const message = new Message(messageData);
  message.save()
      .then(doc => cb(doc))
      .catch(err => cb(null, err));
};

exports.list = (cb) => {

  Message.find({ }, { _id:0, author:1, message:1})
      .populate({ path: 'author', model: user })
      .exec()
      .catch(err => cb(null, err));
};

exports.patchMessage = (id, messageData, cb) => {

  //status code 204 should be returned if we don't want to send back the updated model
  Message.findOneAndUpdate({_id: id}, messageData, {new:true, overwrite:true, projection: { _id:0, author:1, messageData:1}})
      .populate({ path: 'author', model: user })
      .exec()
      .catch(err => cb(null, err));
};

exports.removeById = (messageId, cb) => {

  Message.deleteMany({ _id: messageId })
      .exec()
      .then(() => cb())
      .catch(err => cb(err));

};