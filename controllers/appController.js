const userModel = require('../models/user');
const gameModel = require('../models/game');
const roomModel = require('../models/room')
const mongoose = require('mongoose');
const {multiplayer} = require("./appController");

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

exports.createroom = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesCreated.find(game => game._id == id);

        if (game)
        {
            let room = new roomModel(req.body)
            room.numPlayers = 0;
            room.game = game._id
            room.save()
            .then(result =>
            {
                res.redirect('/multiplayer/' + result._id);
            })
            .catch(err => next(err));
        }
        else
        {
            req.flash('error', 'You cannot play this game as it does not exist on your account');
            res.redirect('/profile');
        }

    })
    .catch(err => next(err));
}

exports.multiplayer = (req, res, next) =>
{
    let id = req.params.id;
    let userID = req.session.user
    roomModel.findById(id)
    .then(room =>
    {
        let user = userModel.findById(userID)
        let numPlayers = room.numPlayers
        let playerType = "player1"
        let waitingForOtherPlayer = false
        if (numPlayers == 0) {
            room.numPlayers = 1
            room.player1 = userID
        } else if (numPlayers == 1) {
            if (room.player1 != userID) {
                room.numPlayers = 2
                room.player2 = userID
                playerType = "player2"
            }
        } else if (numPlayers == 2 && room.player1 != userID && room.player2 != userID) {
            req.flash('error', 'You cannot join this game as it is full');
            res.redirect('/profile');
        }

        room.save()
        console.log(room)
        res.render("./main/multiplayer", {user, room, playerType})

    })
    .catch(err => next(err));

}

exports.disconnected = (req, res, next) =>
{
    roomModel.findById(id)
    .then(room =>
    {
        room.numPlayers = 1
    })
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

exports.previewplayedgame = (req, res, next) =>
{
    let id = req.params.id;
    userModel.findById(req.session.user)
    .then(user =>
    {
        let game = user.gamesPlayed.find(game => game._id == id);
        if (game)
            res.render('./main/gamehistory', {game});
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
    game.p1CapturedPieces = "";
    game.p2CapturedPieces = "";
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

exports.saveplayedgame = (req, res, next) =>
{
    let game = new gameModel(req.body);
    let user = req.session.user;
    game.rating = 0;
    game.p1CapturedPieces = req.body.player1captures;
    game.p2CapturedPieces = req.body.player2captures;
    userModel.updateOne(
    {
        _id: user
    }, 
    { 
        $push: 
        { 
            gamesPlayed: game 
        }
    }
    )
    .then(result =>
    {
        req.flash('success', 'Chess game has been finished');
        res.redirect('/profile');
    })
    .catch(err => next(err));
}

exports.deleteplayedgame = (req, res, next) =>
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
            gamesPlayed: 
            {
                _id: mongoose.Types.ObjectId(gameId)
            }
        }
    })
    .then(user =>
    {
        req.flash('success', 'Played chess game deleted successfully');
        res.redirect('/profile');
    })
    .catch(err => next(err));
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