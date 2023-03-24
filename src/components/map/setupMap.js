import {randomIntFromInterval} from './../../helpers/misc';

let g = window; // apparently already defined somewhere

export const getTestMapMatrix = () => {
  g.m.map = new Array(g.m.MAP_HEIGHT);
  for (let i = 0; i < g.m.MAP_HEIGHT; i++) {
    g.m.map[i] = new Array(g.m.MAP_WIDTH).fill([g.m.FLATLAND, false]);
  }

  g.m.map[1][1] = [g.m.OCEAN, false];
  g.m.map[2][1] = [g.m.OCEAN, false];
  g.m.map[3][1] = [g.m.OCEAN, false];
  g.m.map[4][1] = [g.m.OCEAN, false];
  g.m.map[5][1] = [g.m.OCEAN, false];

  g.m.map[1][2] = [g.m.OCEAN, false];
  g.m.map[2][2] = [g.m.OCEAN, false];
  g.m.map[3][2] = [g.m.OCEAN, false];
  g.m.map[4][2] = [g.m.OCEAN, false];
  g.m.map[5][2] = [g.m.OCEAN, false];

  g.m.map[1][3] = [g.m.OCEAN, false];
  g.m.map[2][3] = [g.m.OCEAN, false];
  g.m.map[3][3] = [g.m.OCEAN, false];
  g.m.map[4][3] = [g.m.OCEAN, false];

  g.m.map[2][4] = [g.m.OCEAN, false];
  g.m.map[3][4] = [g.m.OCEAN, false];

  g.m.map[2][5] = [g.m.OCEAN, false];
  g.m.map[3][5] = [g.m.OCEAN, false];
  g.m.map[4][5] = [g.m.OCEAN, false];

  g.m.map[1][6] = [g.m.OCEAN, false];
  g.m.map[2][6] = [g.m.OCEAN, false];
  g.m.map[3][6] = [g.m.OCEAN, false];
  g.m.map[4][6] = [g.m.OCEAN, false];

  g.m.map[3][7] = [g.m.OCEAN, false];

  g.m.map[3][8] = [g.m.OCEAN, false];

  return g.m.map;
};

export const generateMapMatrixGPT = () => {
  // Initialize the map with all cells set to 0 (empty)
  g.m.map = new Array(g.m.MAP_HEIGHT);
  for (let i = 0; i < g.m.MAP_HEIGHT; i++) {
    g.m.map[i] = new Array(g.m.MAP_WIDTH).fill([g.m.OCEAN, false, null]);
  }

  // Choose a random starting point for the map
  //let startX = Math.floor(Math.random() * g.m.MAP_WIDTH);
  g.startX = 2;
  //let startY = Math.floor(Math.random() * g.m.MAP_HEIGHT);
  g.startY = 2;

  // Use a depth-first search to generate the map
  let stack = [[g.startX, g.startY]];

  g.m.map[1][2] = [g.m.FLATLAND, false];
  g.m.map[2][2] = [g.m.FLATLAND, false];
  g.m.map[3][2] = [g.m.FLATLAND, false];
  g.m.map[4][2] = [g.m.FLATLAND, false];
  g.m.map[5][2] = [g.m.FLATLAND, false];
  g.m.map[6][2] = [g.m.FLATLAND, false];
  g.m.map[7][2] = [g.m.FLATLAND, false];
  g.m.map[8][2] = [g.m.FLATLAND, false];

  g.m.map[2][3] = [g.m.FLATLAND, false];
  g.m.map[3][3] = [g.m.OCEAN, false];
  g.m.map[4][3] = [g.m.FLATLAND, false];
  g.m.map[5][3] = [g.m.FLATLAND, false];
  g.m.map[6][3] = [g.m.FLATLAND, false];
  g.m.map[7][3] = [g.m.FLATLAND, false];
  g.m.map[8][3] = [g.m.FLATLAND, false];

  g.m.map[1][4] = [g.m.FLATLAND, false];
  g.m.map[2][4] = [g.m.FLATLAND, false];
  g.m.map[3][4] = [g.m.FLATLAND, false];
  g.m.map[4][4] = [g.m.FLATLAND, false];
  g.m.map[5][4] = [g.m.OCEAN, false];
  g.m.map[6][4] = [g.m.FLATLAND, false];
  g.m.map[8][4] = [g.m.FLATLAND, false];

  g.m.map[1][5] = [g.m.FLATLAND, false];
  g.m.map[2][5] = [g.m.FLATLAND, false];
  g.m.map[3][5] = [g.m.FLATLAND, false];
  g.m.map[4][5] = [g.m.FLATLAND, false];
  g.m.map[5][5] = [g.m.FLATLAND, false];
  g.m.map[6][5] = [g.m.FLATLAND, false];

  g.m.map[1][6] = [g.m.FLATLAND, false];
  g.m.map[2][6] = [g.m.FLATLAND, false];
  g.m.map[3][6] = [g.m.FLATLAND, false];
  g.m.map[4][6] = [g.m.FLATLAND, false];
  g.m.map[5][6] = [g.m.FLATLAND, false];
  g.m.map[6][6] = [g.m.FLATLAND, false];
  g.m.map[7][6] = [g.m.FLATLAND, false];

  //while (stack.length > 0 ) {
  while (stack.length > 0 && stack.length <= 20) {
    let x, y, neighbors;

    // Pop the top element off the stack
    [x, y] = stack.pop();

    // Mark the cell as part of the map
    g.m.map[y][x] = [g.m.FLATLAND, false, null];
    //g.m.map[y][x] = Math.floor(Math.random() * (i + 1));

    // Get a list of neighbors that are not yet part of the map
    neighbors = getUnvisitedNeighbors(x, y, g.m.map);

    // Add the neighbors to the stack, randomly shuffled
    shuffle(neighbors);
    stack.push(...neighbors);
  }

  function getUnvisitedNeighbors(x, y, map) {
    let neighbors = [];
    if (y > 0 && g.m.map[y - 1][x][0] === g.m.OCEAN) {
      neighbors.push([x, y - 1]);
    }
    if (y < g.m.MAP_HEIGHT - 1 && g.m.map[y + 1][x][0] === g.m.OCEAN) {
      neighbors.push([x, y + 1]);
    }
    if (x > 0 && g.m.map[y][x - 1][0] === g.m.OCEAN) {
      neighbors.push([x - 1, y]);
    }
    if (x < g.m.MAP_WIDTH - 1 && g.m.map[y][x + 1][0] === g.m.OCEAN) {
      neighbors.push([x + 1, y]);
    }
    return neighbors;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  return g.m.map;
};

const heal4SidedLandSquares = () => {
  const matrix = generateMapMatrixGPT();
  let count = 0;
  for (let y = 1; y < matrix.length - 1; y++) {
    for (let x = 1; x < matrix[y].length - 1; x++) {
      if (matrix[x][y] === g.m.OCEAN) {
        if (
          matrix[x + 1][y] === g.m.FLATLAND &&
          matrix[x][y + 1] === g.m.FLATLAND &&
          matrix[x - 1][y] === g.m.FLATLAND &&
          matrix[x][y - 1] === g.m.FLATLAND
        ) {
          matrix[x][y] = g.m.WATER; // 2 -> (fresh) water
          console.log('corrected square: %s,%s', x, y);
        }
      }
      count++;
    }
  }
  console.log('finalMatrix:', matrix);
  return matrix;
};

const healThinStripSurroundedSquares = () => {
  const matrix = heal4SidedLandSquares();
  let count = 0;
  let start;
  let oceanStrip = [];
  for (let x = 1; x < matrix.length - 1; x++) {
    for (let y = 1; y < matrix[x].length - 1; y++) {
      if (matrix[y][x] === g.m.OCEAN) {
        console.log(`matrix[${y}][${x}]=${matrix[y][x]}`);
        if (
          matrix[y + 1][x] === g.m.FLATLAND &&
          matrix[y][x + 1] === g.m.OCEAN && //RIGHT adjacent is OCEAN
          matrix[y - 1][x] === g.m.FLATLAND &&
          matrix[y][x - 1] === g.m.FLATLAND &&
          matrix[y - 1][x + 1] === g.m.FLATLAND &&
          matrix[y + 1][x + 1] === g.m.FLATLAND &&
          matrix[y][x + 2] === g.m.FLATLAND
        ) {
          matrix[y][x] = g.m.WATER;
          matrix[y][x + 1] = g.m.WATER;
        }
        if (
          matrix[y + 1][x] === g.m.OCEAN && //TOP adjacent is OCEAN
          matrix[y][x + 1] === g.m.FLATLAND &&
          matrix[y - 1][x] === g.m.FLATLAND &&
          matrix[y][x - 1] === g.m.FLATLAND &&
          matrix[y + 1][x + 1] === g.m.FLATLAND &&
          matrix[y + 1][x - 1] === g.m.FLATLAND &&
          matrix[y + 2][x] === g.m.FLATLAND
        ) {
          matrix[y][x] = g.m.WATER;
          matrix[y + 1][x] = g.m.WATER;
        }
      }
    }
  }
  return matrix;
};

export const fixLakesGPT = (map) => {
  const findLakeSquares = (x, y, visited, lake) => {
    // Check if the current square is water and not visited
    if (map[x][y][0] === g.m.OCEAN && !visited[x][y]) {
      // Mark the square as visited and add it to the connected component
      visited[x][y] = true;
      lake.push([x, y]);
      // Recursively visit adjacent squares that are water and not visited
      if (x > 0) findLakeSquares(x - 1, y, visited, lake); // up
      if (x < 9) findLakeSquares(x + 1, y, visited, lake); // down
      if (y > 0) findLakeSquares(x, y - 1, visited, lake); // left
      if (y < 9) findLakeSquares(x, y + 1, visited, lake); // right
    }
    let isOcean = false;
    for (let i = 0; i < lake.length; i++) {
      let x, y;
      [x, y] = lake[i];
      if (x === 0 || x === 9 || y === 0 || y === 9) {
        isOcean = true;
      }
    }
    if (isOcean) lake = [];
  };
  const getLargestLakeIdx = function indexOfMax(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }
    return maxIndex;
  };

  function findLakes() {
    // Find all the connected components that represent lakes
    const lakes = [];
    for (let x = 1; x < 9; x++) {
      for (let y = 1; y < 9; y++) {
        // Check if the current square is water and not already visited
        if (map[x][y][0] === g.m.OCEAN && !visited[x][y]) {
          // Initialize a new connected component
          const lake = [];
          // Find all the squares that belong to the lake
          findLakeSquares(x, y, visited, lake);
          // Add the connected component to the lakes array
          lakes.push(lake);
        }
      }
    }
    return lakes;
  }
  function printLakeCoordinatesDebug(lakes) {
    // Print the coordinates of each square that belongs to each lake
    lakes.forEach((lake, index) => {
      //for each lake
      console.log(`Lake ${index + 1}:`);
      lake.forEach((square) => {
        //for each square
        console.log(square); //print the square
        let x, y;
        [x, y] = square;
        map[x][y][0] = g.m.WATER; //change the water (from OCEAN) to a WATER square
      });
    });
  }
  function getLargestLake() {
    const lakeSizes = []; //an array of all the lakes ACTUAL LENGTHS
    lakes.forEach((lake, index) => {
      lakeSizes.push(lake.length);
    });
    let idx = getLargestLakeIdx(lakeSizes);
    return lakes[idx];
  }
  function backToOcean(biggestLake) {
    biggestLake.forEach((square) => {
      console.log('back to ocean:', square);
      let x, y;
      [x, y] = square;
      map[x][y][0] = g.m.OCEAN;
    });
  }

  const visited = Array.from({length: 10}, () =>
    Array.from({length: 10}, () => false)
  );
  const lakes = findLakes();
  printLakeCoordinatesDebug(lakes);
  backToOcean(getLargestLake());
  return map;
};

export const getMapAsList = (matrix) => {
  //const matrix = healThinStripSurroundedSquares();
  //const matrix = getTestMapMatrix();
  //const matrix = mapLake();

  const resultsArray = [];
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      resultsArray.push([x, y, matrix[x][y]]);
    }
  }
  console.log('resultsArray', resultsArray);
  return resultsArray;
};

export const getMapAsList2 = (matrix) => {
  //const matrix = healThinStripSurroundedSquares();
  //const matrix = getTestMapMatrix();
  //const matrix = mapLake();

  const resultsArray = [];
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      resultsArray.push([x, y, matrix[x][y][0], matrix[x][y][1]]);
    }
  }
  console.log('resultsArray', resultsArray);
  return resultsArray;
};

export const test = () => {
  console.log('test');
  console.log(randomIntFromInterval(1, 100));
};

export function getLandResource() {
  const x = randomIntFromInterval(1, 3);
  if (x === 1) {
    //return getFish();
  } else if (x === 2) {
    return getTree();
  } else if (x === 3) {
    return getMountain();
  }
}

function getMountain() {
  if (g.m.numMountains <= g.m.maxMountains) {
    const x = randomIntFromInterval(1, 2);
    if (x === 1) {
      //coin toss (50/50) whether to return a Mountain
      g.m.numMountains++;
      return {
        id: 'mountain' + g.m.numMountains.toString().padStart(2, '0'),
        className: 'mountain',
        emoji: '🏔️',
      };
    }
  }
}

function getTree() {
  if (g.m.numTrees <= g.m.maxTrees) {
    const x = randomIntFromInterval(1, 2);
    if (x === 1) {
      //coin toss (50/50) whether to return a tree
      g.m.numTrees++;
      return {
        id: 'tree' + g.m.numTrees.toString().padStart(2, '0'),
        className: 'tree',
        emoji: '🌲',
      };
    }
  }
}

export function getSeafood() {
  const seafoods = ['🐠', '🐡', '🦈', '🐡', '🐬', '🐡', '🐋', '🐠', '🐡', '🐳'];
  if (g.m.numSeafood <= g.m.maxSeafood) {
    let seafoodIdx = randomIntFromInterval(0, 99);
    seafoodIdx = Math.round(seafoodIdx / 10);
    const seafood = seafoods[seafoodIdx];
    const appearFreq = randomIntFromInterval(1, 10);
    if (appearFreq === 1) {
      //coin toss (50/50) whether to return some Seafood
      g.m.numSeafood++;
      return {
        id: 'seafood_' + g.m.numSeafood.toString().padStart(2, '0'),
        className: 'seafood',
        emoji: seafood,
      };
    }
  }
}
export function getFish() {
  if (g.m.numFish <= g.m.maxFish) {
    g.m.numFish++;
    return {
      id: 'fish' + g.m.numFish.toString().padStart(2, '0'),
      className: 'fish',
      emoji: '🐟',
    };
  }
}

const setMapInits = () => {
  g.m = {};
  g.m.MAP_WIDTH = 10;
  g.m.MAP_HEIGHT = 10;

  g.m.OCEAN = 0;
  g.m.MOUNTAIN = 1;
  g.m.FLATLAND = 10;
  g.m.STONE = 11;
  g.m.TREE = 12;
  g.m.WATER = 20;

  g.m.NORTH = 1;
  g.m.EAST = 2;
  g.m.SOUTH = 3;
  g.m.WEST = 4;
  g.m.numFilled = 0;

  g.m.numTrees = 0;
  g.m.numMountains = 0;
  g.m.numFish = 0;
  g.m.numSeafood = 0;

  g.m.maxTrees = 10;
  g.m.maxMountains = 7;
  g.m.maxFish = 3;
  g.m.maxSeafood = 100;
};
setMapInits();
export default getMapAsList;
