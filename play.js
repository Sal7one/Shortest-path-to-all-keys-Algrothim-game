let gridElm = document.querySelector("#grid");
let movesElm = document.querySelector("#moves");

let g = [ 
  ['C','@','.','D'],
  ['d','.','#','c']
];
let movesAnimation =[];
let gameResult = -1;

generateGrid(g);
findShortestPath(g);

if(gameResult  <= 0)
  movesElm.innerHTML = `Not possible to get all keys`;
else
  movesElm.innerHTML = `Number of moves: ${gameResult}`;

playAnimation(movesAnimation);

function findShortestPath(gameboard){

let maxRows = gameboard.length;
let maxCols = gameboard[0].length;
let startPoint;
let MOVEUP = [0,1];
let MOVEDOWN = [0,-1];
let MOVELEFT = [1,0];
let MOVERIGHT = [-1,0];
let directions = [MOVEUP, MOVEDOWN, MOVELEFT, MOVERIGHT];
let numberOfKeys = 0;

for (let i = 0; i < maxRows; i++) {
  for (let j = 0; j < maxCols; j++) {
    if (gameboard[i][j] === "@") {
      startPoint = [i, j];
    }
    if ("abcdef".includes(gameboard[i][j])) {
      numberOfKeys++;
    }
  }
}

let queue = [[startPoint[0], startPoint[1], [] , 0]];
let visited = new Set();
let lastFoundKey = "";
while (queue.length > 0) {
let cellMoves = new Set();
  let [i, j, keys, moves] = queue.shift();

  if (keys.length === numberOfKeys) {
    gameResult = moves;
    break;
  }

  
  let uniqueStringForMove = `${i}${j}${keys}`;
  if (!visited.has(uniqueStringForMove)) {
    visited.add(uniqueStringForMove);
    
    for (let [x, y] of directions) {
      let new_keys = new Set(keys);
      let row = i + x;
      let col = j + y;

      if (
        row >= 0 && col >= 0 && row < maxRows && col < maxCols 
        && gameboard[row][col] !== "#"
        ) {
          // Lock && We don't have the key just keep going and don't record the move as valid
          if ("ABCDEF".includes(gameboard[row][col]) &&
           !new_keys.has(gameboard[row][col].toLowerCase())) {
            continue;
             }
            // Key
            if ("abcdef".includes(gameboard[row][col])) {
            new_keys.add(gameboard[row][col]);
            lastFoundKey = `${row},${col}`
          }
          queue.push([row, col, Array.from(new_keys), moves+1]);
          cellMoves.add(`${i},${j}`);
        }
    }
  }

  // Remove duplicate moves of the same cell
  if(cellMoves.size > 0){
    movesAnimation.push(Array.from(cellMoves));
  }
}
movesAnimation.push([lastFoundKey]);
}


function playAnimation(listOfMovesMade){

  let setOfMoves = Array.from(listOfMovesMade);
  let timeout = 1000;
  let coordinatesElement = document.querySelector("#coordinates");

  setOfMoves.forEach(cellMove => {
    cellMove.forEach(rowColumn=>{

    let row = rowColumn.split(",")[0]
    let column = rowColumn.split(",")[1]
  setTimeout(()=>{
  coordinatesElement.innerHTML = `Row = ${row}, Column = ${column}`
    let currentCell = document.querySelector(`#index${row}${column}`);
    currentCell.style.background = "red";
    setTimeout(()=>{
      let allBoxes = document.querySelectorAll(".letter")
            
          allBoxes.forEach(box => {
            box.style.background = "teal";
              });
              }, 500)

              setTimeout(()=>{
                coordinatesElement.innerHTML = ``
              },timeout - 1000)
        }, timeout)
        timeout +=1000;
      });
    })
}

function generateGrid(gameboard) {

    // Build unqiue matrix
    let allRows = "";
    for (i = 0; i < gameboard.length; i++) {
        allRows += buildGameRow(i, gameboard[i])
    }

    gridElm.innerHTML = allRows
}

function buildGameRow(indexOfRow, arrayOfGameObjects) {
    let gameObject = ""
    for (let indexOfColumn = 0; indexOfColumn < arrayOfGameObjects.length; indexOfColumn++) {
        const element = arrayOfGameObjects[indexOfColumn];
        let shape = "";

        if(element == "#")
          shape = "🧱"
        if(element == "@")
            shape = "🚩"
        if("abcdef".includes(element))
          shape =  `🗝️ ${element}`
        if("ABCDEF".includes(element))
          shape = `🔒 ${element}`

        gameObject += `<div id="index${indexOfRow}${indexOfColumn}" class="letter" >${shape}</div>`
    }

    return `<div id="index${indexOfRow}"class="row">
   ${gameObject}
  </div>`
}
