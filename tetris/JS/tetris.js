//////////////////////////////////////////
////CREATE THE VARIABLES FOR THE BOARD////
//////////////////////////////////////////
const cvs = $('#tetris')[0];  //use jquery to select the tetris canvas element
const ctx = cvs.getContext("2d"); //get the context of the canvas
const scoreElement = $('#score')[0]; //use jquery to call the score elemnt from the DOM

//////////////////////////////////////
////////SETTING THE GAME BOARD////////
//////////////////////////////////////
const ROW = 20; //20 ROWS
const COL = 10; //10 COLUMNS
const SQ = 30; // the square is 30 px
const VACANT = "WHITE"; // color of an empty square

//////////////////////////////////////
/////FUNCTION TO DRAW THE SQUARES/////
//////////////////////////////////////
function drawSquare(x,y,color){  //the function has three parameters; x - the number of squares from the left, y is the number of squares from the top
    ctx.fillStyle = color; // color will be the color given to the tetromino
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ); //instead of using pixels squares are used, the number of squares on the x and y axis will be counted. 
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

/////////////////////////////////////////
///////LOOP TO DRAW THE GAME BOARD///////
/////////////////////////////////////////
let board = []; //set board to an empty array
for( r = 0; r <ROW; r++){ //use for loop to create the rows
    board[r] = []; //initeate the for loop with an empty array
    for(c = 0; c < COL; c++){  //create columns
        board[r][c] = VACANT; //set every square on the board to white
    }
}

//////////////////////////////////////
/////FUNCTION THE DRAW THE BOARD//////
//////////////////////////////////////
function drawBoard(){ //create drawboard function
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]); //r is the y position, c is the x position
        }
    }
}

drawBoard(); //call the function