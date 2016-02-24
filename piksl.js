
//globals
var pk;
var isPaused = false;
var stepTime = 500;

//constants
var CELLS_WIDE = 100;

function stepModel(){
    if(!isPaused){
        pk.stepRoom();
        setTimeout(stepModel, stepTime);
    }
}

// initializer
$(document).ready(function(){
    pk = new piksl();
    pk.update();
    stepModel();
});

//returns a list of cell objects weighted at the sides of the screen
function randomize(width, height){
    var prob_sides = .96;
    var dropoff = .04;
    var left_weight = 3;

    var cells = [];
    var prob = prob_sides;

    for (i=0;i<width/2;i++){
        //iterate over left half
        for (j = 0;j < height;j++){
            //over the full height
            var rand = Math.random();
            if (rand < prob){
                var cell = {x:i, y:j};
                cells.push(cell);
            }
        }
        prob -= dropoff;
    }

    prob = prob_sides;

    for (i=width;i > width/2;i--){
        //iterate over left half
        for (j = 0;j < height;j++){
            //over the full height
            var rand = Math.random();
            if (rand < prob){
                var cell = {x:i, y:j};
                cells.push(cell);
            }
        }
        prob -= dropoff;
    }

    return cells;
}

function piksl(){
    this.elem = $("#piksel-canvas");
    this.pix_width = this.elem.width();
    this.pix_height = this.elem.height();
    this.cellsize = Math.floor(this.pix_width / CELLS_WIDE);
    this.cellsHigh = Math.floor(this.pix_height / this.cellsize);
    this.renderAgent = new RenderAgent(CELLS_WIDE, this.cellsHigh, this.cellsize);
    this.cells = randomize(CELLS_WIDE, this.cellsHigh);

    this.update = function(){
        this.renderAgent.renderCells(this.cells);
    }

    this.stepRoom = function(){
        this.renderAgent.clearAll();
        this.cells = randomize(CELLS_WIDE, this.cellsHigh);
        this.update();
    }
}

//RenderAgent knows about the actual display.
//This could be used for practically anything.
//This is some damn good code.
function RenderAgent(cellsWide, cellsHigh, cellSize){
    //get the canvas
    this.canvas = document.getElementById("piksel-canvas");
    this.canvas.addEventListener("click", getPosition, false);
    this.cellSize = cellSize;
    //resize the canvas for our new thingy
    this.canvas.width = cellsWide * cellSize; //in pixels
    this.canvas.height = cellsHigh * cellSize; //in pixels
    this.width = this.canvas.width; //in pixels
    this.height = this.canvas.height; //in pixels
    this.cellw = cellSize; // in pixels
    this.cellh = cellSize; //in pixels
    this.context = this.canvas.getContext("2d");
    //bounds of the current view.
    this.topleft = [0,0]; //in cells
    this.bottomright = [cellsWide, cellsHigh]; //in cells
    //what color for state 2 are we currently using?
    //this.color = deadColors[0];
    //Variables for framerate
    this.iteration = 0;
    //this.framerate = $("#framerate");
    this.lastTime = 0;
    //Give it an array of cells to draw.  This method doesn't clear before drawing
    this.renderCells = function(activeCells){
        //load the context onto the board
        this.context.restore();
        var keys = Object.keys(activeCells);
        //iterate over ALL activeCells
        for(i = 0; i< activeCells.length; i++){
            var cell = activeCells[i];

            this.context.fillStyle = "#000000";
            var px = this.cellw * (cell.x - this.topleft[0]);
            var py = this.cellh * (cell.y - this.topleft[1]);
            this.context.fillRect(px, py, this.cellw, this.cellh);
        }
        //save the context for next time
        this.context.save();
        this.iteration++;

        //Every 5 ticks, update the framerate counter
        if (this.iteration % 5 == 0){
          var now = (new Date).getTime();
          var timeSinceLast = now - this.lastTime
          this.lastTime = now;
          //this.framerate.text(Math.floor(5 / (timeSinceLast / 1000)).toString());
        }
    }
    //Use this if clearing is needed.
    this.clearAll = function(){
        this.context.fillStyle = 'rgba(255,255,255,1)';
        this.context.fillRect(0,0,this.width, this.height);
    }
    //Change the view window.  This is used for scrolling around.
    this.setWindow = function(topleft, bottomright){
        this.topleft = topleft;
        this.bottomright = bottomright;
        this.clearAll();
    }
    //Get the cell a set of X Y coords are in. Works even if origin not at top left.
    this.getCellByCoords = function(x, y){
        var row = Math.floor(x / this.cellSize) + this.topleft[0]; //account for window scroll
        var col = Math.floor(y / this.cellSize) + this.topleft[1]; //account for window scroll
        return [row, col];
    }
}
function getPosition(event)
{
  var x = event.clientX;
  var y = event.clientY;

  var canvas = document.getElementById("piksel-canvas");
  var borderwidth = 0;
  x -= (canvas.offsetLeft + borderwidth);
  y -= (canvas.offsetTop + borderwidth);
  //What kind of click was it?
  if (event.ctrlKey){
    //toggle cell off.
    
  } else if (event.shiftKey){
    //toggle cell on
    
  } else {
    //regular click
    
  }
}