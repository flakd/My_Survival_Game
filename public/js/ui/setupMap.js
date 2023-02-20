

  const MAP_WIDTH = 10;
  const MAP_HEIGHT = 10;

  // Initialize the map with all cells set to 0 (empty)
  let map = new Array(MAP_HEIGHT);
  for (let i = 0; i < MAP_HEIGHT; i++) {
    map[i] = new Array(MAP_WIDTH).fill(0);
  }

  // Choose a random starting point for the map
  //let startX = Math.floor(Math.random() * MAP_WIDTH);
  let startX = 3
  //let startY = Math.floor(Math.random() * MAP_HEIGHT);
  let startY = 3

  // Use a depth-first search to generate the map
  let stack = [[startX, startY]];
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

  map[3][3]=0;
  map[4][3]=1;
  map[5][3]=1;
  map[6][3]=0;

  map[3][4]=1;
  map[4][4]=1;
  map[5][4]=1;
  map[6][4]=1;

  map[3][5]=1;
  map[4][5]=1;
  map[5][5]=1;
  map[6][5]=1;

  map[3][6]=0;
  map[4][6]=1;
  map[5][6]=1;
  map[6][6]=0;

  //while (stack.length > 0 ) {
  while (stack.length > 0 && stack.length <= 20) {
    let x, y, neighbors;

    // Pop the top element off the stack
    [x, y] = stack.pop();

    // Mark the cell as part of the map
    map[y][x] = 1;
    //map[y][x] = Math.floor(Math.random() * (i + 1));

    // Get a list of neighbors that are not yet part of the map
    neighbors = getUnvisitedNeighbors(x, y, map);

    // Add the neighbors to the stack, randomly shuffled
    shuffle(neighbors);
    stack.push(...neighbors);
  }

  function getUnvisitedNeighbors(x, y, map) {
    let neighbors = [];
    if (y > 0 && map[y - 1][x] === 0) neighbors.push([x, y - 1]);
    if (y < MAP_HEIGHT - 1 && map[y + 1][x] === 0) neighbors.push([x, y + 1]);
    if (x > 0 && map[y][x - 1] === 0) neighbors.push([x - 1, y]);
    if (x < MAP_WIDTH - 1 && map[y][x + 1] === 0) neighbors.push([x + 1, y]);
    return neighbors;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
