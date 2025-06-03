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

const GameController = (function () {
  let player1;
  let player2;
  let currentPlayer;
  let gameOver = false;

  function startGame() {
    player1 = Player("shajid", "x");
    player2 = Player("labib", "o");

    currentPlayer = player1;
    Gameboard.resetBoard();
  }

  function playRound(index) {
    console.log(`${currentPlayer.name} is playing `)

    if (gameOver) return 
    
    const success = Gameboard.updateBoard(index, currentPlayer.mark);
    if (!success) {
      console.log("invalid move");
    }

    if (CheckWinner()) {
      currentPlayer.score++;
      console.log(`${currentPlayer.name} wins`);
      gameOver = true;
    }
    else if(checkDraw()){
        console.log("its a draw")
        gameOver = true
    }

    switchPlayer();
   
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
  return {
    playRound,
    startGame,
    switchPlayer,
    CheckWinner,
    checkDraw
  };
})();

GameController.startGame();
