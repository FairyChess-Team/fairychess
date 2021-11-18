let FEN = document.getElementById('FENstring').value + " w - - 0 1";

var board, game = new Chess(FEN)

function removeGreySquares() {
    $('#board .square-55d63').css('background', '');
};

function greySquare(square) {
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false;
}

function makeRandomMove() {
  var possibleMoves = game.moves();
  if (possibleMoves.length === 0) return;

  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  var move = game.move(possibleMoves[randomIdx]);
  if (move['captured'])
  {
    let child = document.createElement('img');
    child.setAttribute("src", `/images/w${move['captured'].toUpperCase()}.png`);
    document.getElementById("player2pieces").appendChild(
        child
    );
  }
  board.position(game.fen());
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';
  if (move['captured'])
  {
    let child = document.createElement('img');
    child.setAttribute("src", `/images/b${move['captured'].toUpperCase()}.png`);
    document.getElementById("player1pieces").appendChild(
        child
    );
  }
  window.setTimeout(makeRandomMove, 250);
}

function onMouseoverSquare(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

function onMouseoutSquare(square, piece) {
    removeGreySquares();
};

function onSnapEnd() {
  board.position(game.fen());
}

var config = {
  draggable: true,
  position: FEN,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}
board = Chessboard('board', config)