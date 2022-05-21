require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('MongoDB is Connected')
    });

exports.mongoose = mongoose;
