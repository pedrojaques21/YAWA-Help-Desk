const MessageModel = require('../models/message');

//The callback code could have been refactored in to a single function
exports.insert = (req, res) => {
    MessageModel.createMessage(req.body, (doc, err) => {
        if(!err) res.status(201).send({id: doc._id});
        else res.status(500).send({message: err.message});
    });
};

exports.list = (req, res) => {
    MessageModel.list((docs, err) => {
        if(!err) res.status(200).send(docs);
        else res.status(500).send({message: err.message});
    });
};

exports.getById = (req, res) => {
    MessageModel.findById(req.params.id, (doc, err) => {
        if(!err) res.status(200).send(doc);
        else res.status(500).send({message: err.message});
    });
};

exports.patchById = (req, res) => {
    MessageModel.patchMessage(req.params.id, req.body, (doc, err) => {
        if(!err) res.status(200).send(doc);
        else res.status(500).send({message: err.message});
    });
};

exports.removeById = (req, res) => {
    MessageModel.removeById(req.params.id, (err) => {
        if(!err) res.status(204).send({});
        else res.status(500).send({message: err.message});
    });
};
