const express = require('express');
const controller = require('../controllers/appController');

const router = express.Router();

router.get('/', controller.index);

//router.post('/', controller.adduser)

router.get('/editor', controller.editor);

router.get('/login', controller.login);

router.get('/new', controller.newuser);

router.get('/player', controller.player);

module.exports = router;