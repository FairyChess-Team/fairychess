const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema(
{
    title: {type: String, required: [true, 'cannot be empty']},
    creator: {type: String, required: [true, 'cannot be empty']},
    chessPositions: {type: String},
    rating: {type: Number},
    p1CapturedPieces: {type: Array},
    p2CapturedPieces: {type: Array},
});

module.exports = mongoose.model('Game', gameSchema);