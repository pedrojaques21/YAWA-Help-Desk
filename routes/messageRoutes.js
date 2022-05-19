var messageController = require('../controllers/messageController');

var router = require('express').Router();
var jsonParser = require('body-parser').json();

router.get('/', function (req, res) {
    messageController.list(req, res);
});

router.get('/:id', function (req, res) {
    messageController.getById(req, res);
});

router.post('/', jsonParser, function (req, res) {
    messageController.insert(req, res);
});

router.patch('/:id', jsonParser, function (req, res) {
    messageController.patchById(req, res)
});

router.delete('/:id', function (req, res) {
    messageController.removeById(req, res);
});

//Let's expose these routes
module.exports = router;