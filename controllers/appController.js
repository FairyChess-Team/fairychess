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

exports.editor = (req, res, next) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/editor', {user: user});
    })
    .catch(err => next(err))
}

exports.player = (req, res) =>
{
    userModel.findById(req.session.user)
    .then(user =>
    {
        res.render('./main/player', {user});
    })
    .catch(err => next(err))
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
    .catch(err => next(err));
}

exports.authenticate = (req, res, next) =>
{
    let email = req.body.email;
    let password = req.body.password;

    userModel.findOne({email: email})
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
        userModel.updateOne({_id: user}, {$push: { gamesCreated: game }})
        .then(user =>
        {
            res.redirect('/profile');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err))
}

exports.search = (req, res) =>
{
    res.render('./main/search');
}

//const bodyparser = require('body-parser');
//exports.use(bodyparser.urlencoded({ extended: true }));

exports.searchresult = (req, res, next) =>
{
    let text = req.body.search; 
    let user = req.session.user;

    userModel.findOne({gamesCreated: text})
    .then(user =>
    {
        gameModel.findOne({title: text})
        .then(result =>
        {
            res.render('./main/search', {result});   
        })
        .catch(err => next(err));
    })
    .catch(err => next(err))
}