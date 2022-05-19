const mongoose = require('./mongooseConfigs').mongoose;

//Our user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    date: {
        type: Date,
        default: Date.now
    }
});

//Create the actual model
const User = mongoose.model('users', userSchema);

exports.findById = (id, cb) => {
    User.findById(id, { _id:0, username:1, password:1, email:1})
        .exec()
        .catch(err => cb(null, err));
};

exports.createUser = (userData, cb) => {

    const user = new User(userData);

    user.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err));
};

exports.list = (cb) => {

    User.find({ }, { _id:0, username:1, password:1, email:1})
        .exec()
        .catch(err => cb(null, err));
};

exports.patchUser = (id, userData, cb) => {

    //status code 204 should be returned if we don't want to send back the updated model
    User.findOneAndUpdate({_id: id}, userData, {new:true, overwrite:true, projection: { _id:0, username:1, password:1, email:1}})
        .exec()
        .catch(err => cb(null, err));
};

exports.removeById = (userId, cb) => {

    User.deleteMany({ _id: userId })
        .exec()
        .then(() => cb())
        .catch(err => cb(err));

};