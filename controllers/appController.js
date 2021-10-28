const userModel = require('../models/user');
const gameModel = require('../models/game');

exports.index = (req, res) =>
{
    res.render('./main/index');
};

exports.login = (req, res) =>
{
    res.render('./main/login');
}

exports.editor = (req, res) =>
{
    res.render('./main/editor');
}

exports.player = (req, res) =>
{
    res.render('./main/player');
}

exports.newuser = (req, res) =>
{
    res.render('./main/new');
}

exports.adduser = (req, res, next) =>
{
    console.log(req.body);
    let user = new userModel(req.body);
    user.gamesCreated = new Array();
    user.gamesPlayed = new Array();
    user.save()
    .then(result =>
    {
        res.redirect('/login');
    })
    .catch(err => next(err));
}

exports.authenticate = (req, res, next) =>
{
    
}