let FEN = document.getElementById('FENstring').value;
let player1Captures = document.getElementById('player1Captures').value.split('/');
let player2Captures = document.getElementById('player2Captures').value.split('/');

console.log(player1Captures);
console.log(player2Captures);

player1Captures.forEach(capturedPiece => 
{
    if (capturedPiece !== "" && document.getElementById("player1pieces"))
    {
        if (document.getElementById(`chess_${capturedPiece}`))
        {
            document.getElementById(capturedPiece).textContent = parseInt(document.getElementById(capturedPiece).textContent) + 1;
        }
        else
        {
            let sideAdjust = document.createElement('div');
            sideAdjust.setAttribute('class', 'sideAdjust');
            let itemAdjust = document.createElement('div');
            itemAdjust.setAttribute('class', 'itemAdjust');
            sideAdjust.appendChild(itemAdjust);
            let container = document.createElement('div');
            container.setAttribute('id', `chess_${capturedPiece}`);
            let child = document.createElement('img');
            child.setAttribute("src", `/images/${capturedPiece}.png`);
            let number = document.createElement('label');
            number.textContent = 1;
            number.setAttribute('id', capturedPiece)
            container.appendChild(child);
            container.appendChild(number);
            sideAdjust.childNodes[0].appendChild(container);
            document.getElementById("player1pieces").appendChild(sideAdjust);
            player1Captures[capturedPiece] = 1;
        }
    }
});

player2Captures.forEach(capturedPiece => 
{
    if (capturedPiece !== "" && document.getElementById("player2pieces"))
    {
        if (document.getElementById(`chess_${capturedPiece}`))
        {
            document.getElementById(capturedPiece).textContent = parseInt(document.getElementById(capturedPiece).textContent) + 1;
        }
        else
        {
            let sideAdjust = document.createElement('div');
            sideAdjust.setAttribute('class', 'sideAdjust');
            let itemAdjust = document.createElement('div');
            itemAdjust.setAttribute('class', 'itemAdjust');
            sideAdjust.appendChild(itemAdjust);
            let container = document.createElement('div');
            container.setAttribute('id', `chess_${capturedPiece}`);
            let child = document.createElement('img');
            child.setAttribute("src", `/images/${capturedPiece}.png`);
            let number = document.createElement('label');
            number.textContent = 1;
            number.setAttribute('id', capturedPiece)
            container.appendChild(child);
            container.appendChild(number);
            sideAdjust.childNodes[0].appendChild(container);
            document.getElementById("player2pieces").appendChild(sideAdjust);
            player1Captures[capturedPiece] = 1;
        }
    }
});

var board = Chessboard('board', {
    position: FEN
});