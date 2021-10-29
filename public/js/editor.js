var board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
});

var creatorElement;
var positionElement;

document.addEventListener('DOMContentLoaded', function(event) {
    creatorElement =  document.getElementById("creator");
    positionElement = document.getElementById("position");
});

function finishEditing()
{
    document.getElementById('creator').value = "test";
    document.getElementById('position').value = board.fen();
};

