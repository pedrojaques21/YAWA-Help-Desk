var userController = require('../controllers/userController');

var router = require('express').Router();
var jsonParser = require('body-parser').json();

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