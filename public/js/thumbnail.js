let FEN = document.getElementById('FENstring').value;

var board = Chessboard('board', {
    position: FEN
});