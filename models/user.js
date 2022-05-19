const mongoose = require('./mongooseConfigs').mongoose;
const Schema = mongoose.Schema;
const fetch = require('node-fetch');

//Our user schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    university: String, //let's lookup (consume an external web api) the provided university to complete the information
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subTutors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

//Create the actual model
const User = mongoose.model('users', userSchema);

exports.findById = (id, cb) => {
    User.findById(id, { _id:0, firstName:1, lastName:1, email:1, university:1, tutor:1, subTutors:1})
        .populate({ path: 'tutor', model: User })
        .populate({ path: 'subTutors', model: User })
        .exec()
        .then(async doc => {
            cb(await enrichUniversityInformation(doc));
        })
        .catch(err => cb(null, err));
};

exports.createUser = (userData, cb) => {

    const user = new User(userData);

    //Equivalently as the previous lines, mongoose allows the .then .catch mechanism instead of the callbacks (very similar to JS promises)
    user.save()
        .then(doc => cb(doc))
        .catch(err => cb(null, err)); //In this case the callback signature should be changed to include the err parameter
};

exports.list = (cb) => {

    User.find({ }, { _id:0, firstName:1, lastName:1, email:1, university:1, tutor:1, subTutors:1})
        .populate({ path: 'tutor', model: User })
        .populate({ path: 'subTutors', model: User })
        .exec()
        .then(async docs => {
            const promises = docs.map(async x => {
                return await enrichUniversityInformation(x);
            });
            //let's await for all remote requests to the university REST API to be solved
            cb(await Promise.all(promises));
        })
        .catch(err => cb(null, err));
};

exports.patchUser = (id, userData, cb) => {

    //status code 204 should be returned if we don't want to send back the updated model
    User.findOneAndUpdate({_id: id}, userData, {new:true, overwrite:true, projection: { _id:0, firstName:1, lastName:1, email:1, university:1, tutor:1, subTutors:1}})
        .populate({ path: 'tutor', model: User })
        .populate({ path: 'subTutors', model: User })
        .exec()
        .then(async doc => {
            cb(await enrichUniversityInformation(doc))})
        .catch(err => cb(null, err));
};

exports.removeById = (userId, cb) => {

    User.deleteMany({ _id: userId })
        .exec()
        .then(() => cb())
        .catch(err => cb(err));

};

async function enrichUniversityInformation(userJson){

    if(userJson) {

        //userJson is a mongoose model, we want to use it as JSON to respond back to the client app
        userJson = userJson.toJSON();

        try {
            const universityInfo = await fetch('http://universities.hipolabs.com/search?name=' + encodeURIComponent(userJson.university));
            const jsonData = await universityInfo.json();
            userJson.universityInfo = {
                university: userJson.university,
                externalData: jsonData
            };
        }
        catch(err){
            //In case we can't get some complementary information let's just console the error in the server and continue on to respond with the DB User result
            console.log(err);
        }

    }

    return userJson;
}
