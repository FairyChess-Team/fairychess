const userModel = require('../models/user');
const gameModel = require('../models/game');
const mongoose = require('mongoose');

exports.index = (req, res) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/index');
    })
    .catch(err => next(err))
};

exports.login = (req, res) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/login');
    })
    .catch(err => next(err))
}

exports.editor = (req, res, next) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/editor', {user: user, game: null});
    })
    .catch(err => next(err))
}

exports.editexisting = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);
        res.render('./main/editor', {user, game});
    })
    .catch(err => next(err))
}

exports.player = (req, res) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/player');
    })
    .catch(err => next(err))
}

exports.newuser = (req, res) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/new');
    })
    .catch(err => next(err))
}

exports.adduser = (req, res, next) =>
{
    let user = new userModel(req.body);
    user.gamesCreated = new Array();
    user.gamesPlayed = new Array();
    user.save()
    .then(result =>
    {
        res.redirect('/login');
    })
    .catch(err => 
    {
        if (err.code === 11000)
        {
            err = new Error("Username has already been used");
            err.status = 400;
            return next(err);
        }
        next(err);
    });
}

exports.authenticate = (req, res, next) =>
{
    let username = req.body.username;
    let password = req.body.password;

    userModel.findOne({username: username})
    .then(user =>
    {
        if (user)
        {
            user.comparePassword(password)
            .then(result =>
            {
                if (result)
                {
                    req.session.user = user._id;
                    res.redirect('/');
                }
                else
                {
                    res.redirect('/login');
                }
            });
        }
        else
        {
            res.redirect('/login');
        }
    })
    .catch(err => next(err));
}

exports.logout = (req, res, next) =>
{
    req.session.destroy(err =>
    {
        if (err)
        {
            return next(err);
        }
        else
        {
            res.redirect('/');
        }
    });
}

exports.profile = (req, res, next) =>
{
    let user = req.session.user;
    userModel.findById(user)
    .then(user =>
    {
        res.render('./main/profile', {user});
    })
    .catch(err => next(err));
}

exports.savegame = (req, res, next) =>
{
    let game = gameModel(req.body);
    game.rating = 0;
    game.p1CapturedPieces = new Array();
    game.p2CapturedPieces = new Array();
    game.save()
    .then(result =>
    {
        let user = req.session.user;
        userModel.updateOne(
            {
                _id: user
            }, 
            { 
                $push: 
                { 
                    gamesCreated: game 
                }
            }
        )
        .then(user =>
        {
            res.redirect('/profile');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err))
}

exports.saveexistinggame = (req, res, next) =>
{
    let gameId = req.params.id;
    if (!req.body.chessPositions)
    {
        let error = new Error("Please enter in some chess positions to continue");
        error.status = 400;
        return next(error);
    }
    let user = req.session.user;
    console.log(user);
    userModel.findOneAndUpdate(
        {
            _id: user,
            'gamesCreated._id': mongoose.Types.ObjectId(gameId)
        },
        {
            $set:
            {
                'gamesCreated.$.chessPositions': req.body.chessPositions,
                'gamesCreated.$.title': req.body.title,
                'gamesCreated.$.creator': req.body.creator,
            }
        }
    )
    .then(result =>
    {
        console.log("a result that is ", result);
        res.redirect('/profile');
    })
    .catch(err => next(err))
}

exports.delete = (req, res, next) =>
{
    let gameId = req.params.id;
    let user = req.session.user;

    userModel.updateOne(
        {
            _id: user
        },
        { 
            $pull: 
            { 
                gamesCreated: 
                {
                    _id: mongoose.Types.ObjectId(gameId)
                }
        }
    })
    .then(user =>
    {
        res.redirect('/profile');
    })
    .catch(err => next(err));
}