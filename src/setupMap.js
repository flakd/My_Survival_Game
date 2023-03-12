import {randomIntFromInterval} from './helpers/misc';

let g = window; // apparently already defined somewhere

const getTestMapMatrix = () => {
  setMapInits();
  g.map = new Array(g.m.MAP_HEIGHT);
  for (let i = 0; i < g.m.MAP_HEIGHT; i++) {
    g.map[i] = new Array(g.m.MAP_WIDTH).fill(g.m.FLATLAND);
  }

  g.map[1][2] = g.m.FLATLAND;
  g.map[2][2] = g.m.FLATLAND;
  g.map[3][2] = g.m.OCEAN;
  g.map[4][2] = g.m.OCEAN;
  g.map[5][2] = g.m.OCEAN;
  g.map[6][2] = g.m.OCEAN;
  g.map[7][2] = g.m.FLATLAND;
  g.map[8][2] = g.m.FLATLAND;

  g.map[2][3] = g.m.FLATLAND;
  g.map[3][3] = g.m.OCEAN;
  g.map[4][3] = g.m.OCEAN;
  g.map[5][3] = g.m.OCEAN;
  g.map[6][3] = g.m.OCEAN;
  g.map[7][3] = g.m.FLATLAND;
  g.map[8][3] = g.m.FLATLAND;

  g.map[1][4] = g.m.FLATLAND;
  g.map[2][4] = g.m.FLATLAND;
  g.map[3][4] = g.m.OCEAN;
  g.map[4][4] = g.m.OCEAN;
  g.map[5][4] = g.m.FLATLAND;
  g.map[6][4] = g.m.OCEAN;
  g.map[8][4] = g.m.FLATLAND;

  g.map[1][5] = g.m.FLATLAND;
  g.map[2][5] = g.m.FLATLAND;
  g.map[3][5] = g.m.OCEAN;
  g.map[4][5] = g.m.OCEAN;
  g.map[5][5] = g.m.OCEAN;
  g.map[6][5] = g.m.FLATLAND;

  g.map[1][6] = g.m.FLATLAND;
  g.map[2][6] = g.m.OCEAN;
  g.map[3][6] = g.m.OCEAN;
  g.map[4][6] = g.m.OCEAN;
  g.map[5][6] = g.m.FLATLAND;
  g.map[6][6] = g.m.FLATLAND;
  g.map[7][6] = g.m.FLATLAND;
  return g.map;
};

const genInitMapMatrix = () => {
  setMapInits();
  // Initialize the map with all cells set to 0 (empty)
  g.map = new Array(g.m.MAP_HEIGHT);
  for (let i = 0; i < g.m.MAP_HEIGHT; i++) {
    g.map[i] = new Array(g.m.MAP_WIDTH).fill(g.m.OCEAN);
  }

  // Choose a random starting point for the map
  //let startX = Math.floor(Math.random() * g.m.MAP_WIDTH);
  g.startX = 2;
  //let startY = Math.floor(Math.random() * g.m.MAP_HEIGHT);
  g.startY = 2;

  // Use a depth-first search to generate the map
  let stack = [[g.startX, g.startY]];

  g.map[1][2] = g.m.FLATLAND;
  g.map[2][2] = g.m.FLATLAND;
  g.map[3][2] = g.m.FLATLAND;
  g.map[4][2] = g.m.FLATLAND;
  g.map[5][2] = g.m.FLATLAND;
  g.map[6][2] = g.m.FLATLAND;
  g.map[7][2] = g.m.FLATLAND;
  g.map[8][2] = g.m.FLATLAND;

  g.map[2][3] = g.m.FLATLAND;
  g.map[3][3] = g.m.OCEAN;
  g.map[4][3] = g.m.FLATLAND;
  g.map[5][3] = g.m.FLATLAND;
  g.map[6][3] = g.m.FLATLAND;
  g.map[7][3] = g.m.FLATLAND;
  g.map[8][3] = g.m.FLATLAND;

  g.map[1][4] = g.m.FLATLAND;
  g.map[2][4] = g.m.FLATLAND;
  g.map[3][4] = g.m.OCEAN;
  g.map[4][4] = g.m.FLATLAND;
  g.map[5][4] = g.m.FLATLAND;
  g.map[6][4] = g.m.FLATLAND;
  g.map[8][4] = g.m.FLATLAND;

  g.map[1][5] = g.m.FLATLAND;
  g.map[2][5] = g.m.FLATLAND;
  g.map[3][5] = g.m.FLATLAND;
  g.map[4][5] = g.m.FLATLAND;
  g.map[5][5] = g.m.FLATLAND;
  g.map[6][5] = g.m.FLATLAND;

  g.map[1][6] = g.m.FLATLAND;
  g.map[2][6] = g.m.FLATLAND;
  g.map[3][6] = g.m.FLATLAND;
  g.map[4][6] = g.m.FLATLAND;
  g.map[5][6] = g.m.FLATLAND;
  g.map[6][6] = g.m.FLATLAND;
  g.map[7][6] = g.m.FLATLAND;

  //while (stack.length > 0 ) {
  while (stack.length > 0 && stack.length <= 20) {
    let x, y, neighbors;

    // Pop the top element off the stack
    [x, y] = stack.pop();

    // Mark the cell as part of the map
    g.map[y][x] = g.m.FLATLAND;
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
    if (y < g.m.MAP_HEIGHT - 1 && g.map[y + 1][x] === 0)
      neighbors.push([x, y + 1]);
    if (x > 0 && g.map[y][x - 1] === 0) neighbors.push([x - 1, y]);
    if (x < g.m.MAP_WIDTH - 1 && g.map[y][x + 1] === 0)
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

const heal4SidedLandSquares = () => {
  const matrix = genInitMapMatrix();
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

const mapOutLakeEdge = () => {
  const matrix = getTestMapMatrix();
  const startX = 4;
  const startY = 4;
  let history = [];

  let current = [startX, startY];
  let left; //  [x-11][y]
  let eastValue; //  [x+1][y]
  //for (let y = matrix.length - 1; y >= 0; y--) {
  function findShore(startX, startY) {
    let forwardVal; //  [x][y-1]  -- go north until I find short
    for (let y = startY - 1; y >= 0; y--) {
      forwardVal = matrix[startX][y];
      if (forwardVal === g.m.FLATLAND) {
        let pt = new MapPoint(startX, y + 1, forwardVal);
        history.push(pt);
        return pt;
      }
    }
    return false;
  }
  class MapPoint {
    x = 0;
    y = 0;
    constructor(x, y, val) {
      this.x = x;
      this.y = y;
      this.val = val;
    }
  }
  function walkEast(point) {
    for (let x = point.x; x < matrix.length - 1; x++) {
      let eastValue = matrix[x + 1][point.y];
      let pt = new MapPoint(x + 1, point.y, eastValue);
      history.push(pt);
      if (eastValue === g.m.FLATLAND) turnSouth();
      if (eastValue === g.m.OCEAN) {
        let level = 1;
        function northOrEast(pt, level) {
          if (isNorthOcean(pt)) {
            walkNorth(pt);
          } else {
            walkEast(pt);
          }
          level++;
          northOrEast(pt, level);
        }
      }
    }
  }
  function turnSouth() {}
  function isNorthOcean(point) {
    if (matrix[(point.x, point.y - 1)] === g.m.OCEAN) return true;
    else return false;
  }
  function walkNorth(point) {
    if (point.y > 0) {
      let northValue = matrix[point.x][point.y - 1];
      let pt = new MapPoint(point.x, point.y - 1, northValue);
      history.push(pt);
    }
  }
};

const getMapAsList = () => {
  //const matrix = healThinStripSurroundedSquares();
  const matrix = getTestMapMatrix();
  console.log('matrix', matrix);

  const resultsArray = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      resultsArray.push([matrix[y][x], y, x]);
    }
  }
  console.log('resultsArray', resultsArray);
  return resultsArray;
};

const test = () => {
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

export default getMapAsList;
