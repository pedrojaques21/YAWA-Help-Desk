const UserModel = require('../models/user');


//The callback code could have been refactored in to a single function
exports.insert = (req, res) => {
    UserModel.createUser(req.body, (doc, err) => {
        if(!err) res.status(201).send({id: doc._id});
        else res.status(500).send({message: err.message});
    });
};

exports.list = (req, res) => {
    UserModel.list((docs, err) => {
        if(!err) res.status(200).send(docs);
        else res.status(500).send({message: err.message});
    });
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.id, (doc, err) => {
        if(!err) res.status(200).send(doc);
        else res.status(500).send({message: err.message});
    });
};

exports.patchById = (req, res) => {
    UserModel.patchUser(req.params.id, req.body, (doc, err) => {
        if(!err) res.status(200).send(doc);
        else res.status(500).send({message: err.message});
    });
};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.id, (err) => {
        if(!err) res.status(204).send({});
        else res.status(500).send({message: err.message});
    });
};

exports.findUser = (req, res) => {
    UserModel.findUser(req.params.username, (doc, err) => {
        if(!err) res.status(200).send(doc);
        else res.status(500).send({message: err.message});
    });
  };