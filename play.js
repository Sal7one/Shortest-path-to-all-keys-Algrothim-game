let gridElm = document.querySelector("#grid");
let movesElm = document.querySelector("#moves");
let addbtn  = document.querySelector("#addbtn");
let playbutton  = document.querySelector("#playbutton");
let preparedButton  = document.querySelector("#preparedButton");

addbtn.addEventListener("click", gameMaker);
playbutton.addEventListener("click", startGame);
preparedButton.addEventListener("click", prepared);

let globalGameBoard = null;
let movesAnimation =[];
let gameResult = -1;

function prepared(){
  globalGameBoard = [
    [".",".",".",".",".",],
    [".","@","#",".","d",],
    [".",".","#","c",".",],
    [".",".",".",".",".",]
]
  generateGrid(globalGameBoard);
  findShortestPath(globalGameBoard);
  
  let gameArea = document.querySelector("#game");
  gameArea.style.display = "flex";
  if(gameResult  <= 0)
    movesElm.innerHTML = `Not possible to get all keys`;
  else{
    movesElm.innerHTML = `Tried: ${movesAnimation.length} \n <br> Shortest number of possible moves: ${gameResult}`;
  }
  
  playAnimation(movesAnimation);
  
}

function startGame(){
  let rows = document.querySelectorAll("tr");
  let hasStartingPoint = false;
  let gameBoard = [];

  for (let index = 0; index < rows.length; index++) {
    const listOfTd = rows[index].children;
    let arrayOfChildren = [];
    for (var i = 0; i < listOfTd.length; i++) {
      let cell = listOfTd[i];
      let input = cell.children[0];
      let cleanedCellInput = input.value.replace(/ /g, "");
      if(cleanedCellInput == "@")
        hasStartingPoint = true;

        arrayOfChildren.push(cleanedCellInput);
      }
      gameBoard.push(arrayOfChildren);
  }

  if(!hasStartingPoint){
    showAlert("Starting point Needed!, Add @ in any cell");
    return;
  }

globalGameBoard = gameBoard
generateGrid(gameBoard);
findShortestPath(gameBoard);

let gameArea = document.querySelector("#game");
gameArea.style.display = "flex";
if(gameResult  <= 0)
  movesElm.innerHTML = `Not possible to get all keys`;
else{
  movesElm.innerHTML = `Tried: ${movesAnimation.length} \n <br> Shortest number of possible moves: ${gameResult}`;
}

playAnimation(movesAnimation);

}

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
movesAnimation.push([lastFoundKey]); // Last key added to animation
movesAnimation.shift(); // Start point not needed in animation
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
    currentCell.style.backgroundColor = "#ffa200";
    setTimeout(()=>{
      let allBoxes = document.querySelectorAll(".letter")
            
          allBoxes.forEach(box => {
            box.style.backgroundColor = "#095d14";
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

        gameObject += `
        <div id="index${indexOfRow}${indexOfColumn}" class="letter" >${shape}</div>
        `
    }

    return `<div id="index${indexOfRow}"class="row">
   ${gameObject}
  </div>`
}


function showPlayOptions(){
  playbutton.style.display = "inline";
}

function gameMaker(preparedrows, preparedcols ){

  let rows = 0;
  let cols = 0;

  if(preparedrows == null,  preparedcols == null){
    rows = document.querySelector("#rows");
    cols = document.querySelector("#cols");
  }

  let table = document.querySelector("#gentable");

  let tableRows = "";
  for (let rowNumber= 0; rowNumber < rows.valueAsNumber; rowNumber++) {
    let row = "<tr>"
    for(let colnumber = 0; colnumber < cols.valueAsNumber; colnumber++){
      let column = `<td> <input type="text" value="."/> </td>`;
      row+=column;
    }    
    row+="</tr>"

    tableRows +=row;
  }

  table.innerHTML = `<tbody> ${tableRows}</tbody>`

  showPlayOptions();
}

function showAlert(msg) {
  Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 2500
  })
}
