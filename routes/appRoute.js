const express = require('express');
const controller = require('../controllers/appController');
const {currentlyGuest, loggedIn} = require('../middlewares/authentication');
const {validateChessGame, validateLogin, validateRegistration, validateResults, validateSearch} = require('../middlewares/validation');

const router = express.Router();

router.get('/', controller.index);

router.post('/', currentlyGuest, validateRegistration, validateResults,  controller.adduser)

router.get('/editor', loggedIn, controller.editor);

router.get('/editor/:id', loggedIn, controller.editexisting);

router.get('/login', currentlyGuest, controller.login);

router.post('/login', currentlyGuest, validateLogin, validateResults, controller.authenticate)

router.get('/new', currentlyGuest, controller.newuser);

router.get('/preview/:id', loggedIn, controller.previewgame);

router.get('/logout', loggedIn, controller.logout);

router.get('/profile', loggedIn, controller.profile);

router.post('/search', loggedIn, validateSearch, controller.searchgames);

router.post('/save', loggedIn, validateChessGame, validateResults, controller.savegame);

router.put('/save/:id', loggedIn, validateChessGame, validateResults, controller.saveexistinggame)

router.delete('/delete/:id', loggedIn, controller.delete);

router.get('/thumbnail/:id', loggedIn, controller.generatethumbnail);

module.exports = router;