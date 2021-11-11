exports.currentlyGuest = (req, res, next) =>
{
    if (!req.session.user)
    {
        return next();
    }
    else
    {
        req.flash('error', 'You are already logged in to FairyChess');
        res.redirect('/profile');
    }
}

exports.loggedIn = (req, res, next) =>
{
    if (req.session.user)
    {
        return next();
    }
    else
    {
        req.flash('error', 'You need to be logged in to use this feature');
        res.redirect('/login');
    }
}