require('dotenv').config()

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const assert = require('assert')


router.get('/', (req, res) => {
    var resultArray = []
    mongoose.connect(process.env.CONN_STRING, function(err, db){
        assert.equal(null, err)
        const cursor = db.collection('ticket-data').find()
        cursor.forEach(function(doc,err){
            assert.equal(null, err)
            resultArray.push(doc)
        }, function() {
            db.close()
            res.render('tickets', {items: resultArray})
        })
    })
})

router.post('/', (req, res) => {
    var item = {
        topic: req.body.topic,
        name: req.body.name,
        phone_number: req.body.phone_number,
        e_mail: req.body.e_mail,
        message: req.body.message
    }

    mongoose.connect(process.env.CONN_STRING, function (err, db) {
        assert.equal(null, err)
        db.collection('ticket-data').insertOne(item, function (err, result) {
            assert.equal(null, error)
            console.log('Item inserted')
            db.close()
        })
    })

    res.redirect('/');
})

module.exports = router