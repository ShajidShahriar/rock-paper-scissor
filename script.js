const Gameboard = (function () {
  // let board = [
  //     [0,0,0],
  //     [0,0,0],
  //     [0,0,0]];

  let board = ["", "", "", "", "", "", "", "", ""]; //simpler than 2D

  function resetBoard() {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
    console.log("board reset :", board);

  }

  function updateBoard(index, mark) {
    if (index < 0 || index > board.length) {
      return false;
    }
    if (board[index] === "") {
      board[index] = mark;
      console.log("updated board:", board);
      return true;
    } else {
      return false;
    }

  }
  function getBoard() {
    return [...board];
  }

  return {
    resetBoard,
    updateBoard,
    getBoard
  };
})();

// function Player(name,mark,score){
//     this.name = name;
//     this.mark = mark ;        //idk why but TOP discouraged this method
//     this.score = score;
// }

function Player(name, mark) {
  //use function factory instead ??
  return {
    name,
    mark,
    score: 0,
  };
}
///////////////////////////////////////////////////////////////////////////////START GAME//////////////////////////////////////////////////////////////////////////////////////////////////////
const GameController = (function () {
  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;
  let gameStarted = false
  let hasPlayed = false
  
  function hasStarted(){
    return gameStarted
  }
  function startGame(name1,name2) {
    gameStarted = true
    gameOver = false;
    
    if(!player1 || !player2) {
    player1 = Player(name1, "x");
    player2 = Player(name2, "o");
    }

    currentPlayer = player1;
    Gameboard.resetBoard();
  }

  function playRound(index) {
    console.log(`${currentPlayer.name} is playing `)
    hasPlayed = true

    if (gameOver) return 
    
    const success = Gameboard.updateBoard(index, currentPlayer.mark);
    if (!success) {
      console.log("invalid move");
    }

    if (CheckWinner()) {
      currentPlayer.score++;
      console.log(`player1 : ${player1.score} `)
      console.log(`player2 : ${player2.score}`)
      console.log(`${currentPlayer.name} wins`);
      gameOver = true;
      DisplayController.showGameResult(`${currentPlayer.name} wins!`)
    }
    else if(checkDraw()){
        console.log("its a draw")
        gameOver = true
        DisplayController.showGameResult("its a draw")
    }
  

    switchPlayer();
    DisplayController.updateScoreBoard()
   
  }
  function hasAnyMoveBeenPlayed() {
  return hasPlayed;
}


  function resetGame() {
  player1 = null;
  player2 = null;
  currentPlayer = null;
  gameOver = false;
  gameStarted = false ;
  hasPlayed = false ;
  Gameboard.resetBoard();

}


  function CheckWinner() {
    const board = Gameboard.getBoard();
    const winCombos = [
      [0, 1, 2], // row 1
      [3, 4, 5], // row 2
      [6, 7, 8], // row 3
      [0, 3, 6], // col 1
      [1, 4, 7], // col 2
      [2, 5, 8], // col 3
      [0, 4, 8], // diag
      [2, 4, 6], // diag
    ];

    for (let i = 0; i < winCombos.length; i++) {
      const [a, b, c] = winCombos[i];
      if (
        board[a] === currentPlayer.mark &&
        board[b] === currentPlayer.mark &&
        board[c] === currentPlayer.mark
      ) {
        return true;
      }
    }
    return false;
  }
  function checkDraw(){
    const board = Gameboard.getBoard()
    for(let i = 0 ; i < board.length ; i++){
        if(board[i] === ''){
            return false
        }
        
    }
    return true
  }

  function switchPlayer() {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  }
  function getPlayers() {
  return { player1, player2 };
}

  return {
    playRound,
    startGame,
    switchPlayer,
    CheckWinner,
    checkDraw,
    getPlayers,
    resetGame,
    hasStarted,
    hasAnyMoveBeenPlayed
  };
})();

///////////////////////////////////////////////////////////////////////////////// hell begins here////////////////////////////////////////////////////////////////////////////////////////////// 
// explanations given in the bottom 


const DisplayController = (function(){
  const startScreen = document.getElementById('start-screen');
  const nameScreen = document.getElementById('name-screen');
  const gameScreen = document.getElementById('game-screen');
  const playButton = document.getElementById('play-btn');
  const startGamebutton =document.getElementById('start-game-btn');


  function showNameScreen() {
    startScreen.style.display = "none";
    nameScreen.style.display = "block";
    console.log("Switching to name screen");

  }
  function showGameScreen() {
    
    
    
    
    
    const name1 = document.getElementById("player1-name").value.trim();
    const name2 = document.getElementById("player2-name").value.trim();
   
  if (name1 === "" || name2 === "") {
    alert("Please enter names for both players.");
    return; 
  }

    nameScreen.style.display = "none";
    gameScreen.style.display = "block";
    console.log("switcing to game screen");
    
    GameController.startGame(name1,name2);
    bindCellEvents();
    console.log(`starting game with ${name1} & ${name2}`)
  }
  function renderBoard(){

    const board = Gameboard.getBoard();
    const cells = document.querySelectorAll(".cell")
    

    cells.forEach((cell,index) => {
      cell.textContent = board[index]
    })
  }

  function bindCellEvents() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const index = cell.getAttribute('data-index');
      console.log(`index :${index}`)
      GameController.playRound(parseInt(index));
      renderBoard();
    });
  });
}


function showGameResult(message){
  const messageArea = document.getElementById("message-area")
  messageArea.innerHTML = "" ;

  const resultText = document.createElement("div")
  resultText.textContent = message ;
  resultText.classList.add("result-messgae") ;
  const cells = document.querySelectorAll(".cell")
  const playAgainBtn = document.createElement("button")
  playAgainBtn.textContent = "play-again"
  playAgainBtn.addEventListener("click" , () => {
    messageArea.innerHTML = "" ;
    Gameboard.resetBoard();
    
    cells.forEach(cell => cell.textContent = "");

    const { player1, player2 } = GameController.getPlayers();
    GameController.startGame(player1.name, player2.name);
    updateScoreBoard()
    renderBoard()

  })
  messageArea.appendChild(resultText);
  messageArea.appendChild(playAgainBtn);

}

  function updateScoreBoard(){
    const {player1 , player2} = GameController.getPlayers()
    
    const player1Div = document.getElementById("player1-score")
    const player2Div = document.getElementById("player2-score")

    player1Div.textContent = `${player1.name} : ${player1.score}`
    player2Div.textContent = `${player2.name} : ${player2.score}`
  }


  function gameOver(){

    const gameScreen = document.getElementById("game-screen");
    const nameScreen = document.getElementById("name-screen");

    const hasPlayed = GameController.hasAnyMoveBeenPlayed();

    if (!hasPlayed) {
      // Go directly to name screen, clean everything
      gameScreen.style.display = "none";
      nameScreen.style.display = "block";
      GameController.resetGame(); // clears players and board
      document.getElementById("player1-name").value = "";
      document.getElementById("player2-name").value = "";
      document.getElementById("main-menu-btn").textContent = "End Game";
      return;
    }

    
    
    const winnerDiv = document.querySelector("#winner-box")

    if(!winnerDiv){
      const newWinnerDiv = document.createElement("div")
      newWinnerDiv.id = "winner-box"

      const {player1 , player2} = GameController.getPlayers();
      let message  = ''

      if(player1.score > player2.score){
        message = `game over ! ${player1.name} wins ${player1.score} - ${player2.score}`
      }
      else if(player1.score < player2.score){
        message =  `game over ! ${player2.name} wins ${player2.score} - ${player1.score}`
      }
      else{
        message = `its a tie ! ${player1.score} - ${player2.score}`
      }

      newWinnerDiv.textContent = message
      newWinnerDiv.classList.add("winner-box")

      const gameScreen = document.getElementById("game-screen")
      gameScreen.appendChild(newWinnerDiv)

      const menuButton = document.getElementById("main-menu-btn")
      menuButton.textContent = "Main menu"


    }else{
      winnerDiv.remove();

      const nameScreen = document.getElementById("name-screen")
      const gameScreen = document.getElementById("game-screen")

      gameScreen.style.display = "none" 
      nameScreen.style.display = "block"

      
      GameController.resetGame();
      
      const cells = document.querySelectorAll(".cell")
      cells.forEach(cell => cell.textContent = "");
      const score1 = document.getElementById("player1-score")
      const score2 = document.getElementById("player2-score")

      score1.textContent = ""
      score2.textContent = ""

      const menuBtn = document.getElementById("main-menu-btn")
      menuBtn.textContent = "End Game"
    }

      document.getElementById("player1-name").value = "";
      document.getElementById("player2-name").value = "";

      document.getElementById("player1-name").focus();


  }

  function init(){
    
    playButton.addEventListener('click',showNameScreen);
    startGamebutton.addEventListener('click',showGameScreen)
    const mainMenuBtn = document.getElementById("main-menu-btn");
    mainMenuBtn.addEventListener("click", gameOver);

    //will hook more events here later
    
    console.log("DisplayController initialized");

  }


  return{
    init,
    renderBoard,
    bindCellEvents,
    showGameResult,
    updateScoreBoard,
    gameOver
  }
})()



DisplayController.init();


/////////////////////////////////////////////////////////////// *important(took me days to figure out the flow)* /////////////////////////////////////////////////////////////
/*  Big-picture flow in plain words(summarized with chatgpt):

1. **Page loads** and `DisplayController.init()` wires up two buttons:
   – “Play” shows the name-entry screen (`showNameScreen`).
   – “Start Game” grabs the two names and flips to the game board (`showGameScreen`).

2. **Starting the very first match** (`showGameScreen`):
   • Reads the names from the inputs.  
   • Calls `GameController.startGame(name1, name2)` →  
     – Creates two `Player` objects, gives them marks “x” and “o”.  
     – Resets the board with `Gameboard.resetBoard()` (fills all 9 slots with "").  
     – Sets `currentPlayer` to player 1, clears any `gameOver` flag.  
   • Hooks a click listener on every `.cell` via `bindCellEvents`.  
   • Calls `renderBoard` to push the blank board to the UI.

3. **During a normal turn** (user clicks any cell):
   • The cell’s listener grabs its `data-index` and fires `GameController.playRound(index)`.  
   • Inside `playRound`:
     – If someone already won (`gameOver` true) it bounces out.  
     – Otherwise tries `Gameboard.updateBoard(index, currentPlayer.mark)`.  
       ▸ Rejects if the square’s busy or index out of range.  
     – After a successful drop it checks for a win with `CheckWinner()`:  
       ▸ Loops through all 8 winning combos and compares them to `currentPlayer.mark`.  
     – If win → bumps that player’s `score`, flips `gameOver` to true, then `DisplayController.showGameResult("Alice wins!")`.  
     – Else, `checkDraw()` scans the board for empty squares; if none → draw.  
     – If neither win nor draw, `switchPlayer()` hands the turn to the other player, nothing else happens.  
   • Back in the click listener, `renderBoard()` refreshes the visuals so the new X or O shows up.

4. **End-state UI (`showGameResult`)**:
   • Wipes the message area, drops in a little “X wins!” or “It’s a draw” div.  
   • Builds a **Play Again** button and appends it under the message.

5. **Hitting the Play-Again button**:
   • Anonymous click handler runs:  
     – Clears the message area.  
     – Calls `Gameboard.resetBoard()` (all nine slots go back to "").  
     – Empties every `.cell` text.  
     – Pulls the stored `player1` and `player2` via `GameController.getPlayers()`.  
     – Fires `GameController.startGame(player1.name, player2.name)` so scores reset to 0, board resets, `currentPlayer` becomes player 1 again.  
     – Calls `renderBoard()` to sync the fresh blank board with the screen.  
   • **Important:** the original cell listeners are still attached, so the board is immediately clickable for round 2.

That’s the whole loop: setup → clicks feed `playRound` → a win/draw fires `showGameResult` → Play-Again rebuilds state and kicks off the next match with the same names.  */
