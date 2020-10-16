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
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ); //parameters (x, y, width, height)
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
//creating the array datatype to call later 
const PIECES = [
    [S,"green"], //0
    [T,"purple"], // 1
    [O,"yellow"], //2
    [L,"orange"], // 3
    [I,"cyan"], //4
    [J,"blue"] //5 
    [Z, "red"] //6
];



////////////////////////////////////////////
/////FUNCTION TO GENERATE RANDOM PIECES/////
////////////////////////////////////////////
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) //math.floor rounds the number to an integer
    return new Piece( PIECES[r][0],PIECES[r][1]); //math.raandom generates numbers between 0 and 1  
}  //to generate numbers between 0 and 7, multiply math.random by the length of the tetromino array
//return only the first value (letter) in the tetromino array by using [r][0]
//add the math.random function to the 'moveDown' function, after calling the 'this.lock()" function
//this tells the code that once the tetromino is locked, generate a new tetromino 

let p = randomPiece();



////////////////////////////////////////
/////FUNCTION TO DRAW THE TETROMINO/////
////////////////////////////////////////
function Piece(tetromino,color){ //set the parameters
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern in the array of arrays
    this.activeTetromino = this.tetromino[this.tetrominoN]; //the tetromino we are playing with
    
    this.x = 3; //add the coordnates to set the peices when they appear on the board
    this.y = -2;
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
////////Draw AND UNDRAW THE TETROMINO/////////
//////////////////////////////////////////////
Piece.prototype.draw = function(){
Piece.prototype.unDraw = function(){ //same function as unDraw except use color instead of the color of the tetromino
    this.fill(this.color); 
}


Piece.prototype.unDraw = function(){ //same function as draw except use white color instead of the color of the tetromino
    this.fill(VACANT);
}


//////////////////////////////////////////////
//////////////////////////////////////////////
/////////GIVING THE PIECES MOBILITY///////////
//////////////////////////////////////////////
//////////////////////////////////////////////
Piece.prototype.moveDown = function(){ //function to move down the tetromino
    if(!this.collision(0,1,this.activeTetromino)){ //if there is no collision detected on the board
        this.unDraw(); //call the unDraw function to create vacant squares as the tetromeno moves down
        this.y++; //incriment the y position
        this.draw(); //draw the piece in the new position
    }else{
        // we lock the piece and generate a new one
        //this helps prevent the piece from dragging 
        //down the board
        this.lock(); //when the piece reaches the bottom of the board lock the tetromino
        p = randomPiece(); //call a random tetromino once a piece us locked
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

let score = 0;

/////////////////////////////////////////////
///////FUNCTION TO LOCK THE TETROMINO////////
/////////////////////////////////////////////
Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){ //looping over all the tetromino squares
        for(c = 0; c < this.activeTetromino.length; c++){
            if( !this.activeTetromino[r][c]){ //conditional to skip a vacant square
                continue; 
            }
            if(this.y + r < 0){ //if there are less than 0 vacant squares call the alert function
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break; //break from the loop
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
                   //square's coordinates, active pieces color          
        }
    }


///////////////////////////////////////////////
//////////////RRMOVING A FULL ROW//////////////
///////////////////////////////////////////////

//eleminate the row while incimenting the score by 10 points
//loops need to be in the lock function, because everytime a tetromino reaches the bottom of the board
//check to see if there is a full row 
for(r = 0; r < ROW; r++){ //looping over all the rows on the board
    let isRowFull = true; //declase 'isrowFull'
    for( c = 0; c < COL; c++){ //looping over all the columns on the board
        isRowFull = isRowFull && (board[r][c] != VACANT); //determining if the row is full by checking for vacant squares
    }
    if(isRowFull){ //moving down rows above the full row
        for( y = r; y > 1; y--){ //start from the row, is the row is greater than one then decriment y by 1
            for( c = 0; c < COL; c++){ //looping over the columns
                board[y][c] = board[y-1][c]; //1st row becomes the 2nd, 2nd becomes the 3rd etc..
            }
        }
        for( c = 0; c < COL; c++){ //// the top row board[0][..] has no row above it
            board[0][c] = VACANT; //create a new vacant row
        }
        // increment the score
        score += 10;
    }
}
// update the board
drawBoard();

// update the score
scoreElement.innerHTML = score;
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
// drop the piece every 1 sec

let dropStart = Date.now(); //create function called drop 
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart; //the difference between now and the start of when the tetromino is moved down
    if(delta > 1000){ //created an if statement that if the differnce in the time is less than one second 
        p.moveDown();
        dropStart = Date.now(); //the piece will drop down every one second
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();

