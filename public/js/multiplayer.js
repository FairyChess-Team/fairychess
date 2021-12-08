let FEN = document.getElementById('FENstring').value + " w - - 0 1";
let player1Captures = {};
let player2Captures = {};

var board,
    game = new Chess(FEN);

var socket = io()
var userId = document.getElementById("userId").value
var color = "white"
var players;
var play = true
var roomId = document.getElementById("room").value
var playerType = document.getElementById("playerType").value
var numPlayers = document.getElementById("numPlayers").value

var connect = function(){
    socket.emit('joined', ({roomId, numPlayers, color}))
}

socket.on('play', function(msg) {
    numPlayers = msg.numPlayers
    if (msg.roomId === roomId){
        if(numPlayers == "2")
            state.innerHTML = "Game in Progress";
        else
            state.innerHTML = "Waiting for Second player";
    }
});

socket.on('move', function (msg) {
    if (msg.room == roomId) {
        let player1Captures = msg.player2Captures_server
        let player2Captures = msg.player1Captures_server
        game.move(msg.move)
        board.position(game.fen());
        let move = msg.move;
        if (move['captured']) {
            if (move['color'] === 'w') {
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
                    //document.getElementById("player1captures").value += `/${piece}`;
                    sideAdjust.childNodes[0].appendChild(container);
                    document.getElementById("player1pieces").appendChild(sideAdjust);
                }
                else
                {
                    //document.getElementById("player1captures").value += `/${piece}`;
                    console.log("Piece: " + document.getElementById(piece))
                    document.getElementById(piece).textContent = player1Captures[piece];
                }
            }
            else if (move['color'] === 'b') {
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
                    //document.getElementById("player2captures").value += `/${piece}`;
                    sideAdjust.childNodes[0].appendChild(container);
                    document.getElementById("player2pieces").appendChild(sideAdjust);
                }
                else
                {
                    //document.getElementById("player2captures").value += `/${piece}`;
                    document.getElementById(piece).textContent = player2Captures[piece];
                }
            }
        }
    }
});

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var onDragStart = function (source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
        (game.turn() === 'w' && color === 'black') ||
        (game.turn() === 'b' && color === 'white') ) {
        return false;
    }
};

var onDrop = function (source, target) {
    removeGreySquares();

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
        // NOTE: always promote to a queen for example simplicity
    });
    if (move === null) return 'snapback';
    if (move['captured']) {
        if (move['color'] === 'w') {
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
                //document.getElementById("player1captures").value += `/${piece}`;
                sideAdjust.childNodes[0].appendChild(container);
                document.getElementById("player1pieces").appendChild(sideAdjust);
                player1Captures[piece] = 1;
            }
            else
            {
                player1Captures[piece]++;
                //document.getElementById("player1captures").value += `/${piece}`;
                document.getElementById(piece).textContent = player1Captures[piece];
            }
        }
        else if (move['color'] === 'b') {
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
                //document.getElementById("player2captures").value += `/${piece}`;
                sideAdjust.childNodes[0].appendChild(container);
                document.getElementById("player2pieces").appendChild(sideAdjust);
                player2Captures[piece] = 1;
            }
            else
            {
                player2Captures[piece]++;
                //document.getElementById("player2captures").value += `/${piece}`;
                document.getElementById(piece).textContent = player2Captures[piece];
            }
        }
    }
    // illegal move
    if (move === null) return 'snapback';
    else
        console.log(player1Captures)
        console.log(player2Captures)
        console.log(move)
        socket.emit('move', { move: move, board: game.fen(), room: roomId, player1Captures_server: player1Captures, player2Captures_server: player2Captures });
};

var onMouseoverSquare = function (square, piece) {

    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};

var onSnapEnd = function () {
    board.position(game.fen());
};

socket.on('player', function(msg)  {
    color = msg.color
    numPlayers = msg.numPlayers

    if(numPlayers == "2")
        state.innerHTML = "Game in Progress";

    let cfg = {
        orientation: color,
        draggable: true,
        position: FEN,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };

    board = ChessBoard('board', cfg);
    socket.emit('play', roomId);
});

socket.on('roomId_on_disconnect', function(msg) {
    socket.emit('roomId_on_disconnect', {roomId, userId})
});


//board = ChessBoard('board', cfg);

