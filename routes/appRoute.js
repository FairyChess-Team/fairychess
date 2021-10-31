const express = require('express');
const controller = require('../controllers/appController');

const router = express.Router();

router.get('/', controller.index);

router.post('/', controller.adduser)

router.get('/editor', controller.editor);

router.get('/login', controller.login);

router.post('/login', controller.authenticate)

router.get('/new', controller.newuser);

router.get('/player', controller.player);

router.get('/logout', controller.logout);

router.get('/profile', controller.profile);

router.post('/save', controller.savegame);

router.get('/search', controller.search);

module.exports = router;