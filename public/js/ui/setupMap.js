const misc = require('./../../../src/helpers/misc');
//let g = window;  // apparently already defined somewhere

const genInitMapMatrix = () => {
  g.MAP_WIDTH = 10;
  g.MAP_HEIGHT = 10;

  // Initialize the map with all cells set to 0 (empty)
  g.map = new Array(g.MAP_HEIGHT);
  for (let i = 0; i < g.MAP_HEIGHT; i++) {
    g.map[i] = new Array(g.MAP_WIDTH).fill(0);
  }

  // Choose a random starting point for the map
  //let startX = Math.floor(Math.random() * g.MAP_WIDTH);
  g.startX = 2;
  //let startY = Math.floor(Math.random() * g.MAP_HEIGHT);
  g.startY = 2;

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

  g.map[2][2] = 1;
  g.map[3][2] = 1;
  g.map[4][2] = 1;
  g.map[5][2] = 1;
  g.map[6][2] = 1;
  g.map[7][2] = 1;

  g.map[2][3] = 1;
  g.map[3][3] = 1;
  g.map[4][3] = 2;
  g.map[5][3] = 1;
  g.map[6][3] = 1;

  g.map[3][4] = 1;
  g.map[4][4] = 1;
  g.map[5][4] = 1;
  g.map[6][4] = 1;

  g.map[3][5] = 1;
  g.map[4][5] = 1;
  g.map[5][5] = 2;
  g.map[6][5] = 1;

  g.map[3][6] = 1;
  g.map[4][6] = 1;
  g.map[5][6] = 1;
  g.map[6][6] = 1;

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

const healMap2Sides = () => {
  const matrix = genInitMapMatrix();
  let count = 0;
  for (let y = 1; y < matrix.length - 1; y++) {
    for (let x = 1; x < matrix[y].length - 1; x++) {
      if (matrix[x][y] === 0) {
        if (
          /*           (matrix[x + 1][y] !== 1 &&
            matrix[x][y + 1] === 1 &&
            matrix[x - 1][y] === 1 &&
            matrix[x][y - 1] === 1) || */
          (matrix[x + 1][y] === 1 && matrix[x - 1][y] === 1) ||
          (matrix[x][y + 1] === 1 && matrix[x][y - 1] === 1)
        ) {
          matrix[x][y] = 2; // 2 -> (fresh) water
          console.log('corrected square: %s,%s', x, y);
        }
      }
      count++;
    }
  }
  console.log('finalMatrix:', matrix);
  return matrix;
};

const getMapAsList = () => {
  const matrix = healMap2Sides();
  //const matrix = genInitMapMatrix();
  console.log(matrix);

  const resultsArray = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      resultsArray.push([matrix[x][y], x, y]);
    }
  }
  console.log(resultsArray);
  return resultsArray;
};

const test = () => {
  console.log('test');
  console.log(misc.randomIntFromInterval(1, 100));
};

function getLandResource() {
  const x = misc.randomIntFromInterval(1, 3);
  if (x === 1) {
    //return getFish();
  } else if (x === 2) {
    return getTree();
  } else if (x === 3) {
    return getMountain();
  }
}

function getMountain() {
  if (numMountains <= maxMountains) {
    const x = misc.randomIntFromInterval(1, 2);
    if (x === 1) {
      //coin toss (50/50) whether to return a Mountain
      numMountains++;
      return {
        id: 'mountain' + numMountains.toString().padStart(2, '0'),
        className: 'mountain',
        emoji: '🏔️',
      };
    }
  }
}

function getTree() {
  if (numTrees <= maxTrees) {
    const x = misc.randomIntFromInterval(1, 2);
    if (x === 1) {
      //coin toss (50/50) whether to return a tree
      numTrees++;
      return {
        id: 'tree' + numTrees.toString().padStart(2, '0'),
        className: 'tree',
        emoji: '🌲',
      };
    }
  }
}

function getSeafood() {
  const seafoods = ['🐠', '🐡', '🦈', '🐬', '🐋', '🐳'];
  if (g.numSeafood <= g.maxSeafood) {
    const seafoodIdx = misc.randomIntFromInterval(0, 5);
    const seafood = seafoods[seafoodIdx];
    const appearFreq = misc.randomIntFromInterval(1, 4);
    if (appearFreq === 1) {
      //coin toss (50/50) whether to return some Seafood
      g.numSeafood++;
      return {
        id: 'seafood_' + g.numSeafood.toString().padStart(2, '0'),
        className: 'seafood',
        emoji: seafood,
      };
    }
  }
}
function getFish() {
  if (numFish <= maxFish) {
    numFish++;
    return {
      id: 'fish' + numTrees.toString().padStart(2, '0'),
      className: 'fish',
      emoji: '🐟',
    };
  }
}

g.numFilled = 0;

g.numTrees = 0;
g.numMountains = 0;
g.numFish = 0;
g.numSeafood = 0;

g.maxTrees = 10;
g.maxMountains = 7;
g.maxFish = 3;
g.maxSeafood = 100;

exports.test = test;
exports.getLandResource = getLandResource;
exports.getMountain = getMountain;
exports.getTree = getTree;
exports.getFish = getFish;
exports.getSeafood = getSeafood;
exports.getMapAsList = getMapAsList;
