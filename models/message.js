const mongoose = require('./mongooseConfigs').mongoose;
const Schema = mongoose.Schema;

//Our message schema
const messageSchema = new mongoose.Schema({
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

//Create the actual model
const Message = mongoose.model('messages', messageSchema);

exports.findById = (id, cb) => {
    Message.findById(id, { _id:0, author:1, message:1})
        .exec()
        .catch(err => cb(null, err));
};

exports.createMessage = (messageData, cb) => {

    const message = new Message(messageData);

    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    message.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
};

exports.list = (cb) => {

    Message.find({ }, { _id:0, author:1, message:1})
        .exec()
        .catch(err => cb(null, err));
};

exports.patchMessage = (id, messageData, cb) => {

    //status code 204 should be returned if we don't want to send back the updated model
    Message.findOneAndUpdate({_id: id}, messageData, {new:true, overwrite:true, projection: { _id:0, author:1, message:1}})
        .exec()
        .catch(err => cb(null, err));
};

exports.removeById = (messageID, cb) => {

    Message.deleteMany({ _id: messageID })
        .exec()
        .then(() => cb())
        .catch(err => cb(err));

};
