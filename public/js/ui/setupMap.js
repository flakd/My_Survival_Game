const createMapModel = () => {
  g.MAP_WIDTH = 10;
  g.MAP_HEIGHT = 10;

  // Initialize the map with all cells set to 0 (empty)
  g.map = new Array(g.MAP_HEIGHT);
  for (let i = 0; i < g.MAP_HEIGHT; i++) {
    g.map[i] = new Array(g.MAP_WIDTH).fill(0);
  }

  // Choose a random starting point for the map
  //let startX = Math.floor(Math.random() * g.MAP_WIDTH);
  g.startX = 3;
  //let startY = Math.floor(Math.random() * g.MAP_HEIGHT);
  g.startY = 3;

  // Use a depth-first search to generate the map
  let stack = [[g.startX, g.startY]];
  /*  let stack = [];
   stack.push([3,3]);
   stack.push([4,3]);
   stack.push([5,3]);
 
   stack.push([3,4]);
   stack.push([4,4]);
   stack.push([5,4]);
 
   stack.push([3,5]);
   stack.push([4,5]);
   stack.push([5,5]); */

  g.map[3][3] = 0;
  g.map[4][3] = 1;
  g.map[5][3] = 1;
  g.map[6][3] = 0;

  g.map[3][4] = 1;
  g.map[4][4] = 1;
  g.map[5][4] = 1;
  g.map[6][4] = 1;

  g.map[3][5] = 1;
  g.map[4][5] = 1;
  g.map[5][5] = 1;
  g.map[6][5] = 1;

  g.map[3][6] = 0;
  g.map[4][6] = 1;
  g.map[5][6] = 1;
  g.map[6][6] = 0;

  //while (stack.length > 0 ) {
  while (stack.length > 0 && stack.length <= 20) {
    let x, y, neighbors;

    // Pop the top element off the stack
    [x, y] = stack.pop();

    // Mark the cell as part of the map
    g.map[y][x] = 1;
    //g.map[y][x] = Math.floor(Math.random() * (i + 1));

    // Get a list of neighbors that are not yet part of the map
    neighbors = getUnvisitedNeighbors(x, y, g.map);

    // Add the neighbors to the stack, randomly shuffled
    shuffle(neighbors);
    stack.push(...neighbors);
  }

  function getUnvisitedNeighbors(x, y, map) {
    let neighbors = [];
    if (y > 0 && g.map[y - 1][x] === 0) neighbors.push([x, y - 1]);
    if (y < g.MAP_HEIGHT - 1 && g.map[y + 1][x] === 0)
      neighbors.push([x, y + 1]);
    if (x > 0 && g.map[y][x - 1] === 0) neighbors.push([x - 1, y]);
    if (x < g.MAP_WIDTH - 1 && g.map[y][x + 1] === 0)
      neighbors.push([x + 1, y]);
    return neighbors;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  return g.map;
};

/* const getFlattenedMap = () => {
  const matrix = createMapModel();
  const resultsArray = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      resultsArray.push(matrix[x]);
    }
  }
  return resultsArray;
}; */

exports.createMapModel = createMapModel;
//exports.getFlattenedMap = getFlattenedMap;
