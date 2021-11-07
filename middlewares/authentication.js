exports.currentlyGuest = (req, res, next) =>
{
    if (!req.session.user)
    {
        return next();
    }
    else
    {
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
        res.redirect('/login');
    }
}