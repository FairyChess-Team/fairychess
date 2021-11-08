let FEN = document.getElementById('FENstring').value;

function onDrop(source, target, piece, newPos, oldPos, orientation)
{
    $("#chessPositions").val(Chessboard.objToFen(newPos));
}

var board = Chessboard('board', {
    draggable: true,
    position: FEN,
    dropOffBoard: 'trash',
    sparePieces: true,
    onDrop: onDrop
});

$('#clear').on('click', board.clear);