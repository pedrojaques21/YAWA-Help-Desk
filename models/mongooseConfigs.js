const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://DBW17:PlX4Qc8nQAsvuraM@clusterdbw.1dbjr.mongodb.net/DBW17?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(()=>{
        console.log('MongoDB is Connected')
    });

exports.mongoose = mongoose;
