export function buildGrid(cont, x, y){
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
            row.appendChild(cell);
            cell.addEventListener("mousedown", function(){
                console.log(this.id);
                //cellClicked()
            });
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
    newCell.className = 'cell cell'+cellNum;
    newCell.id = 'cell'+cellNum+'_'+rowNum;
    return newCell;
}