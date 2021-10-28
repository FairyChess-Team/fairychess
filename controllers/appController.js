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