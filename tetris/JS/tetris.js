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

///////////////////////////////////
///////DRAW THE TETROMINOES////////
///////////////////////////////////
//the tetromino pieces are already created in the tetrominoes.js file. 
const PIECES = [
    [S,"green"],
    [T,"purple"],
    [O,"yellow"],
    [L,"orange"],
    [I,"cyan"],
    [J,"blue"]
    [Z, "red"]
];



////////////////////////////////////////////
/////FUNCTION TO GENERATE RANDOM PIECES/////
////////////////////////////////////////////
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}


////////////////////////////////////////
/////FUNCTION TO DRAW THE TETROMINO/////
////////////////////////////////////////
function Piece(tetromino,color){ //set the parameters
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern in the array of arrays
    this.activeTetromino = this.tetromino[this.tetrominoN]; //the tetromino we are playing with
    
    this.x = 3; //add the coordnates to set the peices when they appear on the board
    this.y = 0;
}

//////////////////////////////////////////////
//////CREATES PATTERIN FOR THE TETERMINO//////
////////////TO APPEAR ON THE BOARD////////////
//////////////////////////////////////////////
Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // telling the code to only draw on the filled squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

//////////////////////////////////////////////
//////////////////////////////////////////////
/////////GIVING THE PIECES MOBILITY///////////
//////////////////////////////////////////////
//////////////////////////////////////////////
Piece.prototype.moveDown = function(){ //function to move down the tetromino
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++; //incriment the y position
        this.draw(); //draw the piece in the new position
    }else{
        // we lock the piece and generate a new one
        //this helps prevent the piece from dragging 
        //down the board
        this.lock();
        p = randomPiece();
    }
    
}
 
Piece.prototype.moveRight = function(){ //function to move right the tetromino
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw(); //call the undraw function to prevent the tetromino from dragging
        this.x++; //incriment in the x position 
        this.draw();
    }
}

Piece.prototype.moveLeft = function(){ //function to move left the tetromino
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw(); //call the undraw function to prevent the tetromino from dragging
        this.x--; //decriment in the x position 
        this.draw();
    }
}

Piece.prototype.rotate = function(){ //function to rotate the tetromino
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length]; // tetrominoN was set to 0, this means that the remainder will be 1
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){ //call collsion function so the tetromino does not move off of the board
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){ //create the collision function 
        this.unDraw(); //call the unDraw function to move the piece back to the board
        this.x += kick; //move the tetromino to the left or right of the board
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // tetrominoN was set to 0, this means that the remainder will be 1
        this.activeTetromino = this.tetromino[this.tetrominoN]; //update the active tetromino
        this.draw(); //call the draw function to see the piece
    }
}

///////////////////////////////////////////////
///////JQUERY EVENT LISTENER FUNCTION//////////
///////////////////////////////////////////////
// CONTROL the piece
$(function() {
    $(document).keydown(function(event) {
        if(event.keyCode == 37){ //if the left arrow button is called move tetromino to the left
            p.moveLeft();
            dropStart = Date.now();
        }else if(event.keyCode == 38){ //if the up arrow button is called move tetromino up
            p.rotate();
            dropStart = Date.now();
        }else if(event.keyCode == 39){ //if the right arrow button is called move tetromino to the right
            p.moveRight();
            dropStart = Date.now();
        }else if(event.keyCode == 40){ //if the down arrow button is called move tetromino down
            p.moveDown();
        }
    });
 
});

//////////////////////////////////////////////////////////
////CREATE TIMMER TO ALLOW PIECE TO MOVE DOWN STEADILY////
//////////////////////////////////////////////////////////
// drop the piece every 1sec

let dropStart = Date.now(); //create function called drop 
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart; //the difference between now and the start of when the tetromino is moved down
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();