const userModel = require('../models/user');
const gameModel = require('../models/game');
const mongoose = require('mongoose');

exports.index = (req, res) =>
{
    res.render('./main/index');
};

exports.login = (req, res) =>
{
    res.render('./main/login');
}

exports.newuser = (req, res) =>
{
    res.render('./main/new');
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
            req.flash('error', 'This email address has already been used');
            return res.redirect('back');
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
                    req.flash('success', 'Successfully logged in');
                    res.redirect('/');
                }
                else
                {
                    req.flash('error', 'Incorrect password provided');
                    res.redirect('/login');
                }
            });
        }
        else
        {
            req.flash('error', 'Incorrect email address provided');
            res.redirect('/login');
        }
    })
    .catch(err => next(err));
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

exports.searchgames = (req, res, next) =>
{
    let search = req.body.name;
    let user = req.session.user;
    userModel.findById(user)
    .then(user =>
    {
        let games = user.gamesCreated.filter(game => game.title.includes(search));
        if (games.length > 0)
            res.render('./main/search', {games});
        else
        {
            req.flash('error', `There are no games matching search term (${search})`);
            res.redirect('back');
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

exports.editor = (req, res, next) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/editor', {user, game: null});
    })
    .catch(err => next(err))
}

exports.player = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);
        if (game)
            res.render('./main/player', {user, game});
        else
        {
            req.flash('error', 'You cannot play this game as it does not exist on your account');
            res.redirect('/profile');
        }
    })
    .catch(err => next(err));
}

exports.editexisting = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);
        if (game)
            res.render('./main/editor', {user, game});
        else
        {
            req.flash('error', 'You cannot modify this game as it does not exist on your account');
            res.redirect('/profile');
        }
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
        req.flash('success', 'Chess game deleted successfully');
        res.redirect('/profile');
    })
    .catch(err => next(err));
}

exports.previewgame = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);
        if (game)
            res.render('./main/previewer', {game});
        else
        {
            req.flash('error', 'You cannot preview this game as it does not exist on your account');
            res.redirect('/profile')
        }
    })
    .catch(err => next(err))
}

exports.savegame = (req, res, next) =>
{
    if (req.body.chessPositions === "")
    {
        req.flash('error', 'Enter in some chess positions to continue');
        return res.redirect('back');
    }
    let game = gameModel(req.body);
    game.rating = 0;
    game.p1CapturedPieces = new Array();
    game.p2CapturedPieces = new Array();
    game.save()
    .then(result =>
    {
        let user = req.session.user;
        req.session.editorPieces = req.body.chessPositions;
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
        .then(result =>
        {
            req.flash('success', 'Chess game created successfully');
            res.redirect('/profile');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err))
}

exports.saveexistinggame = (req, res, next) =>
{
    let gameId = req.params.id;
    if (req.body.chessPositions === "")
    {
        req.flash('error', 'Enter in some chess positions to continue');
        return res.redirect('back');
    }
    let user = req.session.user;
    req.session.editorPieces = req.body.chessPositions;
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
    })
    .then(result =>
    {
        req.flash('success', 'Chess game updated successfully');
        res.redirect('/profile');
    })
    .catch(err => next(err))
}

exports.saveplayedcomputergame = (req, res, next) =>
{
    userModel.findOneAndUpdate(
    {
        _id: user
    },
    {
        
    })
    .then(user =>
    {

    })
    .catch(err =>next(err));
}

exports.generatethumbnail = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);
        if (game)
            res.render('./main/thumbnail', {game});
    })
    .catch(err => next(err))
}