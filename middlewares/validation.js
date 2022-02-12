const {body, validationResult} = require('express-validator');

exports.validateRegistration = 
[
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('username', 'Username cannot be empty').notEmpty().trim().escape(),
    body('password', 'Password cannot be empty and can be only at most 64 characters').notEmpty().trim().escape().isLength({max: 64})
];

exports.validateLogin = 
[
    body('username', 'Username cannot be empty').notEmpty().trim().escape(),
    body('password', 'Password cannot be empty and can be only at most 64 characters').notEmpty().trim().escape().isLength({max: 64})
];

exports.validateEditedChessGame =
[
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('creator', 'Creator cannot be empty').notEmpty().trim().escape(),
    body('chessPositions', 'Chess positions cannot be empty').notEmpty().trim().escape()
];

exports.validatePlayedChessGame =
[
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('creator', 'Creator cannot be empty').notEmpty().trim().escape(),
    body('chessPositions', 'Chess positions cannot be empty').notEmpty().trim().escape(),
    body('player1captures', 'Player 1 captured pieces cannot be empty').notEmpty().trim().escape(),
    body('player2captures', 'Player 2 captured pieces cannot be empty').notEmpty().trim().escape(),
];

exports.validateSearch = 
[
    body('name', 'Name cannot be empty').notEmpty().trim().escape()
]

exports.validateResults = (req, res, next) =>
{
    let errors = validationResult(req);
    if (!errors.isEmpty())
    {
        errors.array().forEach(error =>
        {
            req.flash('error', error.msg)
        });
        return res.redirect('back');
    }
    else
        return next();
}
