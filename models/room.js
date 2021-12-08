const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
{
    player1: {type: Schema.Types.ObjectId, ref: "User"},
    player2: {type: Schema.Types.ObjectId, ref: "User"},
    numPlayers: {type: Number},
    game: {type: Schema.Types.ObjectId, ref: "Game"}
});

module.exports = mongoose.model('Room', roomSchema);