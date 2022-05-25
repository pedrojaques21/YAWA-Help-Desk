var express = require('express');
var userController = require('../controllers/userController');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const router = express.Router();

router.get('/', function (req, res) {
    userController.list(req, res);
});

router.get('/:id', function (req, res) {
    userController.getById(req, res);
});

router.post('/', jsonParser, function (req, res) {
    userController.insert(req, res);
});

router.patch('/:id', jsonParser, function (req, res) {
    userController.patchById(req, res)
});

router.delete('/:id', function (req, res) {
    userController.removeById(req, res);
});

//Let's expose these routes
module.exports = router;