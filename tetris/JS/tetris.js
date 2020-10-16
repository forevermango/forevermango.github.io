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
const SQ = squareSize = 30; //
const VACANT = "WHITE"; // color of an empty square