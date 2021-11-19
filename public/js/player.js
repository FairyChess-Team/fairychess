let FEN = document.getElementById('chessPositions').value + " w - - 0 1";

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
  var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  var move = game.move(possibleMoves[randomIdx]);
  if (move['captured'])
  {
    let piece = `w${move['captured'].toUpperCase()}`;
    let child = document.createElement('img');
    document.getElementById("player2captures").value += `/${piece}`;
    child.setAttribute("src", `/images/${piece}.png`);
    document.getElementById("player2pieces").appendChild(child);
  }
  board.position(game.fen());
  if (game.game_over())
  {
    let button = document.getElementById("finishGame");
    if (button)
    {
      document.getElementById('chessPositions').value = game.fen();
      button.click();
    }
  }
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
    let piece = `b${move['captured'].toUpperCase()}`;
    let child = document.createElement('img');
    document.getElementById("player1captures").value += `/${piece}`;
    child.setAttribute("src", `/images/${piece}.png`);
    document.getElementById("player1pieces").appendChild(
        child
    );
  }
  if (game.game_over())
  {
    let button = document.getElementById("finishGame");
    if (button)
    {
      document.getElementById('chessPositions').value = game.fen();
      button.click();
    }
  }
  else
    window.setTimeout(makeRandomMove, 250);
}

function onMouseoverSquare(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    removeGreySquares();
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