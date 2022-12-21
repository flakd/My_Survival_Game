let startCellNumStr = "";

function drawMap(){
  const grid = document.querySelector('.grid');
  const log = document.querySelector("#log");

  let numCell = 0;
  let numCellStr = "";

  let numFilled = 0;
  let numFishes = 0;
  let numTrees = 0;
  let numMountains = 0;

  // Iterate over the map array and create a cell element for each element
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {  
      let cell = document.createElement('div');
      cell.id = numCell.toString().padStart(2,"0");
      cell.setAttribute("name",x + "," + y);
      cell.classList.add('cell');
      if (map[y][x] === 1) {
        cell.classList.add('filled');
        //if (startCellNum === null) startCellNum = numCell;   
        numCellStr = numCell.toString().padStart(2,"0");     
        if (startCellNumStr === "") startCellNumStr = numCellStr;   
        cell.innerHTML=   "<span id='player_"+numCellStr+"' class='player' style='display:none; z-index:100'>🚶🏻</span>";
        if (numFishes === 0) {
          cell.innerHTML+=  "<div id='fish_"+numCellStr+"' class='fish'>🐟</div>";
          numFishes++;
        } else if (numTrees === 0) {
          cell.innerHTML+=  "<div id='tree_"+numCellStr+"' class='tree'>🌲</div>";
          numTrees++;          
        } else if (numMountains === 0) {
          cell.innerHTML+=  "<div id='mountain_"+numCellStr+"' class='mountain'>🏔️</div>";
          numMountains++;          
        }

      }
      grid.appendChild(cell);
      numCell++;
    }
  }
} // END: function drawMap()