const mapOutLakeEdge = () => {
  class MapPoint {
    x = 0;
    y = 0;
    constructor(x, y, val) {
      this.x = x;
      this.y = y;
      this.val = val;
    }
  }
  const matrix = getTestMapMatrix();
  const startX = 4;
  const startY = 4;
  let shoreline = [];

  let current = [startX, startY];
  let left; //  [x-11][y]
  let eastValue; //  [x+1][y]
  //for (let y = matrix.length - 1; y >= 0; y--) {
  function findShore(startX, startY) {
    let forwardVal; //  [x][y-1]  -- go north until I find shore
    for (let y = startY - 1; y >= 0; y--) {
      forwardVal = matrix[startX][y];
      if (forwardVal === g.m.FLATLAND) {
        let pt = new MapPoint(startX, y - 1, forwardVal);
        shoreline.push(pt);
        return pt;
      }
    }
    return false;
  }

  function walkEast(point) {
    for (let x = point.x; x < matrix.length - 1; x++) {
      let eastValue = matrix[x + 1][point.y];
      let pt = new MapPoint(x + 1, point.y, eastValue);
      shoreline.push(pt);
      if (eastValue === g.m.FLATLAND) turnSouth();
      if (eastValue === g.m.OCEAN) {
        let level = 1;
        function northOrEast(pt, level) {
          console.log(pt);
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
  function getNextSpaceForward(currentSquare, currentDirection) {
    return newSqIWouldBeOn;
  }
  function turnRight(currentDirection) {
    return newDirection;
  }
  function turnLeft(currentDirection) {
    return newDirection;
  }

  function walkCoast(startingPos) {
    if (findShore()) {
      //which is to the NORTH
      turnRight(g.m.NORTH); //I am now facing EAST
      let forwardCandidate = getNextSpaceForward([5, 4], g.m.EAST);
      if (forwardCandidate === g.m.OCEAN) {
        walkForward();
        turnLeft(g.m.EAST);
        let forwardCandidate = getNextSpaceForward([6, 4], g.m.NORTH);
        if (forwardCandidate === g.m.OCEAN) {
          walkForward();
          turnLeft(g.m.EAST);
        }
      } else {
        turnRight(g.m.EAST);
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
      let northPoint = new MapPoint(point.x, point.y - 1, northValue);
      shoreline.push(northPoint);
    }
  }
};
