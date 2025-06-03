const Gameboard = (function(){

    // let board = [
    //     [0,0,0],
    //     [0,0,0],
    //     [0,0,0]];


    let board = ['','','','','','','','',''] //simpler than 2D

    function resetBoard(){
        for(let i=0; i<board.length; i++){
            board[i] = '' ;
        }
        console.log("board reset :" ,board)
    }

    function updateBoard(index,mark){
        if(index < 0 || index > board.length){
            return false
        }
        if(board[index] === ''){
            board[index] = mark
            return true
        }
        else{
            return false
        }

        console.log("updated board:",board)

    }

    return {
        resetBoard,
        updateBoard
    }
})();

