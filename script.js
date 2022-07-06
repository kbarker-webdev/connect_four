const board = [];

const gameState = {
  board: board,
  players: ['red', 'yellow']
}

for (i = 0; i < 7; i++) {
  board.push([])
}


const table = document.getElementsByTagName('table')[0];
const divSetPlayers = document.getElementById("players")
const btnSetPlayers = document.getElementsByTagName('button')[0];
const txtPlayer1 = document.getElementById("txtPlayer1");
const txtPlayer2 = document.getElementById("txtPlayer2");
const divGame = document.getElementsByTagName("div")[3];
divGame.setAttribute('style', 'display: none');
btnSetPlayers.addEventListener('click', setPlayers);
let player1 = "";
let player2 = "";
let isReady = false;
let currentPlayer = 0;
let gameWinner = "";

function playSoundFX(sound) {
  let sfx = new Audio("./sfx/" + sound);
    sfx.play();
}

function setPlayers(event) {
  if (event.target.textContent === "NEW GAME") {
    location.reload();
  } else {
    let p1 = document.getElementById('p1');
    let p2 = document.getElementById('p2');
    if (txtPlayer1.value === "" || txtPlayer2.value === "") {
       alert("Please enter names for Player1 & Player2.");
    } else {
      event.target.textContent = "NEW GAME";
      divSetPlayers.setAttribute("style", "display: none");
      player1 = txtPlayer1.value;
      player2 = txtPlayer2.value;
      p1.innerText = player1
      p2.innerText = player2
      drawBoard();
      setRandomPlayer();
      isReady = true;
      divGame.setAttribute('style', 'display: flex');
    }
  }
}

function setRandomPlayer() {
  currentPlayer = Math.floor(Math.random() * 2);
  console.log(currentPlayer);
  switch(currentPlayer){
    case 0:
      p1Lite.style.visibility = "visible";
      p2Lite.style.visibility = "hidden";
      break;
    case 1:
      p1Lite.style.visibility = "hidden";
      p2Lite.style.visibility = "visible";
      break;
  }
}

function drawBoard() {
  let colNum = 0;
  let rowNum = 0;
  for (j = 0; j < 6; j++) {
    const row = document.createElement('tr');
    colNum = 0;
    for (i = 0; i < 7; i++) {
      const td = document.createElement('td');
      td.setAttribute("column", colNum);
      td.setAttribute("row", rowNum);
      colNum++;
      row.appendChild(td);
    }
    rowNum++;
    table.appendChild(row);
  }
}

table.addEventListener('click', makeMove)

function makeMove(event) {
  if (isReady) {
    let column = event.path[0].attributes[0].value;
    updateGameState(column, gameState.players[currentPlayer]);
    updateVisualBoard(column);
    playSoundFX("drop_1.wav")
  } else {
    alert("CREATE NEW GAME!");
  }
}



function updateVisualBoard(column){
  let columnGS = gameState.board[column];
  let r = 5;
  for (i = 0; i < columnGS.length; i++) {
    let currentTD = document.querySelectorAll('[column="' + column + '"][row="' + r + '"]');
    currentTD[0].className = columnGS[i];
    r--;
  }
}


let p1Lite = document.getElementById("p1turn");
let p2Lite = document.getElementById("p2turn");


function updateGameState(column, player) {
  if (board[column].length < 6) {
    board[column].push(player);
    switch (player) {
      case "red":
        currentPlayer = 1;
        p1Lite.style.visibility = "hidden";
        p2Lite.style.visibility = "visible";
        break;
      case "yellow":
        currentPlayer = 0;
        p2Lite.style.visibility = "hidden";
        p1Lite.style.visibility = "visible";
        break;
    }
  }

  checkForWin();
}


function checkForWin() {
  let idx = 0
  while (idx < 7) {
    let verticalArray = gameState.board[idx];
    checkArray(verticalArray);

    let horizontalArray = getHorizontalArray(idx);
    checkArray(horizontalArray);

    let diagonalArrayRight = getDiagonalArrayRight(idx);
    checkArray(diagonalArrayRight);

    let diagonalArrayLeft = getDiagonalArrayLeft(idx);
    checkArray(diagonalArrayLeft);

    let diagonalArrayTopRight = getDiagonalArrayTopRight(idx);
    checkArray(diagonalArrayTopRight);

    let diagonalArrayTopLeft = getDiagonalArrayTopLeft(idx);
    checkArray(diagonalArrayTopLeft);

    idx++
  }

}

function getHorizontalArray(indx) {
  let newArray = [];
  for (i = 0; i < 7; i++) {
    let currValue = gameState.board[i][indx];
    if (typeof currValue === 'undefined') {
      newArray.push("none");
    } else {
      newArray.push(currValue);
    }
  }
  return newArray;
}

function getDiagonalArrayTopRight(increment) {
  let newArray = [];
  for (i = 0; i < 6; i++) {
    let currValue;
    try {
      currValue = gameState.board[i][i + increment];
    } catch {
      currValue = undefined;
    } finally {
      if (typeof currValue === 'undefined') {
        newArray.push("none");
      } else {
        newArray.push(currValue);
      }
    }
  }
  return newArray;
}

function getDiagonalArrayTopLeft(increment) {
  let newArray = [];
  for (i = 0; i < 6; i++) {
    let currValue;
    try {
      currValue = gameState.board[6 - i][i + increment];
    } catch {
      currValue = undefined;
    } finally {
      if (typeof currValue === 'undefined') {
        newArray.push("none");
      } else {
        newArray.push(currValue);
      }
    }
  }
  return newArray;
}
      

function getDiagonalArrayRight(increment) {
  let newArray = [];
  for (i = 0; i < 6; i++) {
    let currValue;
    try {
      currValue = gameState.board[i + increment][i];
    } catch {
      currValue = undefined;
    } finally {
      if (typeof currValue === 'undefined') {
        newArray.push("none");
      } else {
        newArray.push(currValue);
      }
    }
  }
  return newArray;
}
    
function getDiagonalArrayLeft(increment) {
  let newArray = [];
  for (i = 0; i < 6; i++) {
    let currValue;
    try {
      currValue = gameState.board[(6 - i) - increment][i];
    } catch {
      currValue = undefined;
    } finally {
      if (typeof currValue === 'undefined') {
        newArray.push("none");
      } else {
        newArray.push(currValue);
      }
    }
  }
  return newArray;
}
    


function checkArray(arr) {
  let counterRed = 0;
  let counterYellow = 0;
  let winner = "none"
  if (arr.length > 0) {
    for (x = 0; x < arr.length; x++) {
      let currentColor = arr[x];
      if (currentColor === "red") {
        counterRed += 1;
        counterYellow = 0;
      } else if (currentColor === "yellow") {
        counterYellow += 1;
        counterRed = 0;
      } else {
        counterRed = 0;
        counterYellow = 0;
      }
      if (counterRed === 4) {
        winner = "red";
      } else if (counterYellow === 4) {
        winner = "yellow";
      }
    }
  }

  switch (winner) {
    case "red":
      gameWinner = player1;
      break;
    case "yellow":
      gameWinner = player2
      break;
  }

  if (winner !== 'none') {
    gameOver(winner);
  }
  
  
}

function blinkIt() {
  let winnerText = document.getElementById('win');
  for(i = 0; i < 5; i++){
    var blink = winnerText;
    var visiblity = blink.style.visibility;
    blink.style.visibility = visiblity == 'visible' ? 'hidden' : 'visible';
   }
 }

function gameOver(winner) {
  let winnerText = document.getElementById('win');
  winnerText.innerText = (gameWinner.toUpperCase() + " IS THE WINNER!");
  setInterval(blinkIt, 250);
  if (winner != 'none') {
    isReady = false;
  }
}
