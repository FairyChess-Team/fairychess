let FEN = document.getElementById('chessPositions').value + " w - - 0 1";
let player1Captures = new Array();
let player2Captures = new Array();

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
    if (!player2Captures[piece])
    {
      let sideAdjust = document.createElement('div');
      sideAdjust.setAttribute('class', 'sideAdjust');
      let itemAdjust = document.createElement('div');
      itemAdjust.setAttribute('class', 'itemAdjust');
      sideAdjust.appendChild(itemAdjust);
      let container = document.createElement('div');
      container.setAttribute('id', `chess_${piece}`);
      let child = document.createElement('img');
      child.setAttribute("src", `/images/${piece}.png`);
      let number = document.createElement('label');
      number.textContent = 1;
      number.setAttribute('id', piece)
      container.appendChild(child);
      container.appendChild(number);
      document.getElementById("player2captures").value += `/${piece}`;
      sideAdjust.childNodes[0].appendChild(container);
      document.getElementById("player2pieces").appendChild(sideAdjust);
      player2Captures[piece] = 1;
    }
    else
    {
      player2Captures[piece]++;
      document.getElementById("player2captures").value += `/${piece}`;
      document.getElementById(piece).textContent = player2Captures[piece];
    }
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
    if (!player1Captures[piece])
    {
      let sideAdjust = document.createElement('div');
      sideAdjust.setAttribute('class', 'sideAdjust');
      let itemAdjust = document.createElement('div');
      itemAdjust.setAttribute('class', 'itemAdjust');
      sideAdjust.appendChild(itemAdjust);
      let container = document.createElement('div');
      container.setAttribute('id', `chess_${piece}`);
      let child = document.createElement('img');
      child.setAttribute("src", `/images/${piece}.png`);
      let number = document.createElement('label');
      number.textContent = 1;
      number.setAttribute('id', piece)
      container.appendChild(child);
      container.appendChild(number);
      document.getElementById("player1captures").value += `/${piece}`;
      sideAdjust.childNodes[0].appendChild(container);
      document.getElementById("player1pieces").appendChild(sideAdjust);
      player1Captures[piece] = 1;
    }
    else
    {
      player1Captures[piece]++;
      document.getElementById("player1captures").value += `/${piece}`;
      document.getElementById(piece).textContent = player1Captures[piece];
    }
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