function addShapeToBoard(){
    let newShapeOnBoard = new Shape();
    shapesOnScreen.push(newShapeOnBoard);
    currentShape = shapesOnScreen[shapesOnScreen.length-1];
}

var gridObject = {
    width: 0,
    height: 0
}

var currentShape = null;

var shapesOnScreen = [];

document.addEventListener('keydown', function(event) {
    if(currentShape.canMove){
        const keyPressed = checkKey();
        if(keyPressed){
            if(keyPressed != 'up'){    
                userMoveShape(currentShape, keyPressed);
            } else {
                rotateShape(currentShape);
            }
        } else {
            console.log("-- wrong key pressed");
        }
    }
});

window.onload = function() {
    let cont = document.getElementById("lo-res");
    gridObject.width = 10;
    gridObject.height = 15;
    cont.appendChild(buildGrid(cont, gridObject.width, gridObject.height));
    let gameTickInterval = setInterval(gameTick, 400);

        var div = document.getElementsByClassName('cell')[0];
        
        div.addEventListener('click', function (event) {
            console.log(div);
        });
}



function gameTick(){
    // do gravity
    
    if(currentShape == null){
        console.log('-- no current shape. Adding shape');
        addShapeToBoard();

    } else {
        if(currentShape.canMove){
            //console.log('-- current shape still active.');
            gravityTick(currentShape);
        } else {
            //console.log('-- current shape stopped. Adding shape');
            checkForFullRow();
            addShapeToBoard();
        }
    }
/*
    const cells = document.querySelectorAll('.cell')
    cells.forEach(a => a.innerHTML = "");

    const elems = document.querySelectorAll('.filled')
    elems.forEach(a => a.innerHTML = "F");

    */
}

function gravityTick(shape){

    // if the shape can fall then remove the .filled  .color class from current blocks
    // then color new cells
    if(shapeCanMove(shape, 'down').new.length > 0){
        clearShape(shapeCanMove(shape, 'down').old, shape.color);
        moveShape(shapeCanMove(shape, 'down').new, shape.color);
        shape.center_point.y++;
    } else {
        shape.canMove = false;
    }
}

function rotateShape(shape){
    let newOrientation = null;
    if(shape.orientation == 'n'){
        newOrientation = shape.shapes.e;
    } else if(shape.orientation == 'e'){
        newOrientation = shape.shapes.s;
    } else if(shape.orientation == 's'){
        newOrientation = shape.shapes.w;
    } else {
        newOrientation = shape.shapes.n;
    }

    if(shapeCanRotate(shape, newOrientation)){
        clearShape(shapeCanMove(shape, 'down').old, shape.color);
        if(shape.orientation == 'n'){
            shape.orientation = 'e';
            shape.shape = shape.shapes.e;
        } else if(shape.orientation == 'e'){
            shape.orientation = 's';
            shape.shape = shape.shapes.s;
        } else if(shape.orientation == 's'){
            shape.orientation = 'w';
            shape.shape = shape.shapes.w;
        } else if(shape.orientation == 'w'){
            shape.orientation = 'n';
            shape.shape = shape.shapes.n;
        }
        moveShape(getCurrentShapeLocation(currentShape), currentShape.color);
    }
}

function userMoveShape(shape, direction){
    let change = { x: 0, y: 0 }
    if(direction == 'left'){
        change.x = -1;
    } else if(direction == 'right'){
        change.x = 1;
    } else if(direction == 'down'){
        change.y = 1;
    } else {
        change.y = 0;
    }
    let shapesCellInfo = shapeCanMove(shape, direction);

    if(shapesCellInfo.new.length > 0){

        clearShape(shapesCellInfo.old, shape.color);
        moveShape(shapesCellInfo.new, shape.color);
        shape.center_point.y += change.y;
        shape.center_point.x += change.x;
    }
}

/** Wipe the shape from the cells */
function clearShape(cellList, color){
    for(let i in cellList){
        let cell = document.getElementById(cellList[i]);
        if(cell == null){
            
        }
        if(cell){
            cell.classList.remove('filled');
            cell.classList.remove(color);
        }
    }
}

function moveShape(cellList, color){
    for(let i in cellList){
        let cell = document.getElementById(cellList[i]);
        if(cell){
            cell.classList.add('filled');
            cell.classList.add(color);
        }
    }
}

function clearScreen(){
    let grid = document.getElementById('grid');
    let cells = grid.querySelectorAll('.cell');
    for(let i in cells){
        cells[i].classList.remove('filled');
        cells[i].classList.remove('orange');
        cells[i].classList.remove('blue');
        cells[i].classList.remove('green');
        cells[i].classList.remove('pink');
    }
}

function drawScreen(){
    for(let i in shapesOnScreen){
        let thisShape = shapesOnScreen[i];
        for(let j in thisShape.shape){
            let cell = document.getElementById(cellList[j]);
            if(cell){
                cell.classList.add('filled');
                cell.classList.add(color);
            }
        }
    }
    
}

function updateShapesOnScreenList(){

    for(let i in shapesOnScreen){
        let thisShape = shapesOnScreen[i];   
    }

}


function checkForFullRow(){
    let rows = document.querySelectorAll('.row');
    rows.forEach((row, index) => {
        let cells = row.querySelectorAll('.cell');
        let rowFilled = true;
        cells.forEach(cell => {
            if(cell.classList.contains('filled')){
                
            } else {
                rowFilled = false;
            }
        });
        if(rowFilled){
            console.log('row filled number:'+index)
        }
    });
}

function cascadeFallEffect(cells){
    let numberOfFalls = 0;

    cells.forEach(cell => {
        cell.classList.remove('filled');
        cell.classList.remove('orange');
        cell.classList.remove('blue');
        cell.classList.remove('green');
        cell.classList.remove('pink');
    });

    let allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        if(cell.classList.contains('filled')){
            let color = getColorOfCell(cell);
            cell.classList.remove('filled');
            cell.classList.remove(color);
            let x = cell.getAttribute('x');
            let y = parseInt(cell.getAttribute('y'), 10) + 1;
            let cellBelow = document.getElementById("cell"+x+"_"+y);
            if(!cellBelow.classList.contains('filled') && cellBelow != null){
                cellBelow.classList.add(color);
                cellBelow.classList.add('filled');
            }
        }
    });

    if(numberOfFalls > 0){
        setTimeout(cascadeFallEffect(), 500);
    } else {
        // all done
    }
}

function getColorOfCell(cell){
    if(cell.classList.contains("orange")){
        return "orange";
    } else if(cell.classList.contains("pink")){
        return "pink";
    } else if(cell.classList.contains("green")){
        return "green";
    } else if(cell.classList.contains("blue")){
        return "blue";
    }
}

//////////////////
// Constructors //
//////////////////

function buildGrid(cont, x, y){
    var grid = document.createElement('div');
    grid.id = 'grid';
    let rowNum = 0;
    let colNum = 0;
    var newDiv = document.createElement('div');
    
    let i = 0; // counter for the row
    // build the rows
    while(i < y){
        let j = 0; // counter for the cell - needs to reset for each row
        let row = buildRow(i);
        grid.appendChild(row);
        while(j < x){
            let cell = buildCell(i, j);
            cell.setAttribute('x', j);
            cell.setAttribute('y', i);
            row.appendChild(cell);
            j++;
        }
        i++;
    }
    return grid;
}

function buildRow(rowNum){
    var newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = 'row'+rowNum;
    return newRow;
}

function buildCell(rowNum, cellNum){
    var newCell = document.createElement('div');
    newCell.className = 'cell default cell'+cellNum;
    newCell.id = 'cell'+cellNum+'_'+rowNum;
    return newCell;
}


/////////////////////////
//  Complete functions //
/////////////////////////

function isFilled(cellID) {
    let cell = document.getElementById(cellID);
    if(cell){
        return cell.classList.contains('filled');
    } else {
        
    }
    
    
}


// two choices
// work out all the cells the shape will occupy minus any squares it currently is
// the filled function works out if that cell is part of the active shape


/** Check to see if all cells below this shape are !.filled - returns new coords */
function shapeCanMove(shape, direction){
    let change = { x: 0, y: 0 };
    if(direction == 'left'){
        change.x = -1;
    } else if(direction == 'right'){
        change.x = 1;
    } else {
        change.y = 1;
    }

    // the list of cell IDs the shape will occupy next
    let listOfCells = {
        old: [],
        new: [],
        cellsToCheck: []
    };
    for(let i in shape.shape){
        let thisCellCoord = { x: (shape.center_point.x + shape.shape[i].x), y: (shape.center_point.y + shape.shape[i].y)};
        let oldCellID = 'cell'+thisCellCoord.x+'_'+thisCellCoord.y;
        let newCellID = 'cell'+(thisCellCoord.x + change.x)+'_'+(thisCellCoord.y + change.y);
        listOfCells.old.push(oldCellID);
        // only add cell to new list if it is not out of bounds
        if((thisCellCoord.y + change.y) > (gridObject.height-1) || (thisCellCoord.x + change.x) < 0 || (thisCellCoord.x + change.x) > (gridObject.width - 1)){
            // this cell is out of bounds
        } else {
            listOfCells.new.push(newCellID);
        }
    }
    
    for(let i in listOfCells.new){
        if(listOfCells.old.includes(listOfCells.new[i])){
            // don't add
        } else {
            listOfCells.cellsToCheck.push(listOfCells.new[i]);
        }
    }

    // loop through the new list of cells and add any that are not currently occupied by this shape to a new array. Then check if that cell is filled.
    // This 
    for(let i in listOfCells.cellsToCheck){
        if(isFilled(listOfCells.cellsToCheck[i])){
            return { new: [], old: [] }
        }
    }

    // check to see if 
    if(listOfCells.new.length == shape.shape.length){
        return listOfCells;
    } else {
        return { new: [], old: [] };
    }
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        return 'up';
    }
    else if (e.keyCode == '40') {
        return 'down';
    }
    else if (e.keyCode == '37') {
        return 'left';
    }
    else if (e.keyCode == '39') {
        return 'right';
    }
}

/** Returns the list of cell IDs the shape currently occupies. */
function getCurrentShapeLocation(shape){
    let listOfCellIDs = [];
    let cp = shape.center_point;
    for(let i in shape.shape){
        let ID = 'cell'+(shape.shape[i].x + cp.x)+'_'+(shape.shape[i].y + cp.y);
        listOfCellIDs.push(ID);
    }
    return listOfCellIDs;
}

/** Check to see if shape can rotate */
function shapeCanRotate(shape, orientation){
    // get the new cells the shape would occupy with its new shape
    // check if any of those cells would be out of bounds or are occupied
    let cp = shape.center_point;
    let listofOldCells = getCurrentShapeLocation(shape);
    let listOfNewCells = [];
    for(let i in orientation){
        let newPos = {
            x: (orientation[i].x + cp.x),
            y: (orientation[i].y + cp.y)
        }
        if(newPos.x > (gridObject.width-1) || newPos.x < 0){
            return false;
        }
        if(newPos.y > (gridObject.height-1) || newPos.y < 0){
            return false;
        }
        let newCellID = 'cell'+newPos.x+'_'+newPos.y;
        if(!listofOldCells.includes(newCellID)){
            listOfNewCells.push(newCellID);
        }
        
    }
    for(let i in listOfNewCells){
        let cell = document.getElementById(listOfNewCells[i]);
        if(cell.classList.contains('filled')){
            return false;
        }
    }
    return true;
}

/** Returns the list of cell IDs the shape will occupy next. */
function getNextShapeLocation(shape, direction){
    let change = { x: 0, y: 0 };
    if(direction == 'left'){
        change.x = -1;
    } else if(direction == 'right'){
        change.x = 1;
    } else if(direction == 'down'){
        change.y = 1;
    }
    let listOfCellIDs = [];
    let cp = shape.center_point;
    for(let i in shape.shape){
        let ID = 'cell'+(shape.shape[i].x + cp.x + change.x)+'_'+(shape.shape[i].y + cp.y + change.y);
        listOfCellIDs.push(ID);
    }
    return listOfCellIDs;
}

/** Shape Class */
class Shape {
    center_point = { x: 4, y: -2 };
    orientation = 'n';
    canMove = true;

    constructor() {
        let listOfShapes = [
            t_shape,
            l_shape,
            square_shape,
            straight_shape
        ]
        let i = Math.floor(Math.random() * Math.floor(listOfShapes.length));
        this.shapes = listOfShapes[i].shapes;
        this.color = listOfShapes[i].color;
        this.shape = this.shapes.n;

    }
}

var t_shape = {
    color: 'orange',
    shapes: {
        n: [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 2},
            {x: 0, y: 0}
        ],
        e: [
            {x: -1, y: 0},
            {x: -2, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 0}
        ],
        s: [
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: -2},
            {x: 0, y: 0}
        ],
        w: [
            {x: -1, y: 0},
            {x: 2, y: 0},
            {x: 1, y: 0},
            {x: 0, y: -1},
            {x: 0, y: 0}
        ]
    }
}

var square_shape = {
    color: 'green',
    shapes: {
        n: [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: -1}
        ],
        e: [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: -1}
        ],
        s: [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: -1}
        ],
        w: [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: -1}
        ]
    }
}

var l_shape = {
    color: 'blue',
    shapes: {
        n: [
            {x: 0, y: -2},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0}
        ],
        e: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 0, y: 1}
        ],
        s: [
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 2}
        ],
        w: [
            {x: 0, y: 0},
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: -2, y: 0}
        ]
    }
}

var straight_shape = {
    color: 'pink',
    shapes: {
        n: [
            {x: 0, y: -2},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ],
        e: [
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0}
        ],
        s: [
            {x: 0, y: 0},
            {x: 0, y: -1},
            {x: 0, y: 1},
            {x: 0, y: 2}
        ],
        w: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: -1, y: 0},
            {x: -2, y: 0}
        ]
    }
}