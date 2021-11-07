function resetFEN()
{
    let FEN = document.getElementById('FENstring').value;
    return FEN;
}

function onDrop(source, target, piece, newPos, oldPos, orientation)
{
    $("#chessPositions").val(Chessboard.objToFen(newPos));
}

var board = Chessboard('board', {
    draggable: true,
    position: resetFEN(),
    dropOffBoard: 'trash',
    sparePieces: true,
    onDrop: onDrop
});

$('#clear').on('click', board.clear);

console.log(resetFEN());