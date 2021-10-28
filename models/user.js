const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
{
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, required: [true, 'cannot be empty'], unqiue: true},
    password: {type: String, required: [true, 'cannot be empty']},
    gamesCreated: {type: Array},
    gamesPlayed: {type: Array},
});

userSchema.pre('save', function(next)
{
    let user = this;
    if (!user.isModified('password'))
        return;
    bcrypt.hash(password, 10)
    .then(hash =>
    {
        user.password = hash;
        next();
    })
    .catch(err => next(err))
});

userSchema.methods.comparePassword = function(loginPassword)
{
    return bcrypt.compare(loginPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);