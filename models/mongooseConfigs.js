require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.CONN_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('MongoDB is Connected')
    })
    .catch((err) =>{
        console.log(`An error ocorred during your connection with MongoDB: ${err}`)
    });

exports.mongoose = mongoose;
