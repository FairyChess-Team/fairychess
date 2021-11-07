const express = require('express');
const controller = require('../controllers/appController');
const authentication = require('../middlewares/authentication');

const router = express.Router();

router.get('/', controller.index);

router.post('/', controller.adduser)

router.get('/editor', authentication.loggedIn, controller.editor);

router.get('/editor/:id', authentication.loggedIn, controller.editexisting);

router.get('/login', authentication.currentlyGuest, controller.login);

router.post('/login', authentication.currentlyGuest, controller.authenticate)

router.get('/new', authentication.currentlyGuest, controller.newuser);

router.get('/player', authentication.loggedIn, controller.player);

router.get('/logout', authentication.loggedIn, controller.logout);

router.get('/profile', authentication.loggedIn, controller.profile);

router.post('/save', authentication.loggedIn, controller.savegame);

router.delete('/delete/:_id', authentication.loggedIn, controller.delete);

module.exports = router;