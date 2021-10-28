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