const mongoose = require('./mongooseConfigs').mongoose;

//Our user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createDate: {
        type: Date,
        default: Date.now
    }
});

//Create the actual model
module.exports = mongoose.model('User', userSchema);
