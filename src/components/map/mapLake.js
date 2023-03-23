import {getTestMapMatrix, generateMapMatrixGPT} from './setupMap';

let g = window;

class TPoint {
  constructor(y, x) {
    this.y = y;
    this.x = x;
    this.terrain = map[y][x][0];
    this.isShoreline = map[y][x][1];
    this.resource = map[y][x][2];
  }
}

const TDirection = {
  North: Symbol('North'),
  East: Symbol('East'),
  South: Symbol('South'),
  West: Symbol('West'),
};

class TAvatar {
  moveCount = 500;
  recursionLevel = 0;
  allHistory = [];
  moveHistory = [];
  lookHistory = [];
  LNMoveHistory = [];
  Position;
  Direction;

  InitialPosition; //: TPoint;
  InitialDirection; //: TDirection

  PotentialNewPosition; //: TPoint
  constructor(pos, dir) {
    this.Position = this.InitialPosition = pos;
    this.Direction = this.InitialDirection = dir;
  }
  TurnRight() {
    this.Direction = TR(this.Direction);
    function TR(currrenDirection) {
      if (currrenDirection === TDirection.North) return TDirection.East;
      else if (currrenDirection === TDirection.East) return TDirection.South;
      else if (currrenDirection === TDirection.South) return TDirection.West;
      else return TDirection.North;
    }
    return this.Direction;
  }
  TurnLeft() {
    this.Direction = TL(this.Direction);
    function TL(currrenDirection) {
      if (currrenDirection === TDirection.North) return TDirection.West;
      else if (currrenDirection === TDirection.West) return TDirection.South;
      else if (currrenDirection === TDirection.South) return TDirection.East;
      else return TDirection.North;
    }
    return this.Direction;
  }

  getNextPossSquare() {
    this.PotentialNewPosition = getNextSquareForward(
      this.Position,
      this.Direction
    );
    console.log('PotentialNewPosition: ', this.PotentialNewPosition);
    return this.PotentialNewPosition;
    function getNextSquareForward(Position, dir) {
      let x, y;
      switch (dir) {
        case TDirection.North:
          x = Position.x;
          y = Position.y - 1;
          return new TPoint(y, x);
        case TDirection.East:
          x = Position.x + 1;
          y = Position.y;
          return new TPoint(y, x);
        case TDirection.South:
          x = Position.x;
          y = Position.y + 1;
          return new TPoint(y, x);
        case TDirection.West:
          x = Position.x - 1;
          y = Position.y;
          return new TPoint(y, x);
      }
    }
  }
  nextSquareIsOcean() {
    return this.PotentialNewPosition.terrain === g.m.OCEAN;
  }
  Move() {
    //----------1------------
    this.TurnLeft();
    this.getNextPossSquare();
    if (this.nextSquareIsOcean()) {
      this.moveForward();
      return;
    }
    this.blockedMustTurn();
    console.log('TL: %o: Dir: %s', this.Position, this.Direction);
    this.recordAllHistory(this.Position);
    this.recordLookHistory();

    //----------2------------
    this.TurnRight();
    this.getNextPossSquare();
    if (this.nextSquareIsOcean()) {
      this.moveForward();
      return;
    }
    this.blockedMustTurn();
    console.log('TR1: %o: Dir: %s', this.Position, this.Direction);
    this.recordAllHistory(this.Position);
    this.recordLookHistory();

    //----------3------------
    this.TurnRight();
    this.getNextPossSquare();
    if (this.nextSquareIsOcean()) {
      this.moveForward();
      return;
    }
    this.blockedMustTurn();
    console.log('TR2: %o: Dir: %s', this.Position, this.Direction);
    this.recordAllHistory(this.Position);
    this.recordLookHistory();

    //----------4------------
    this.TurnRight();
    this.getNextPossSquare();
    if (this.nextSquareIsOcean()) {
      this.moveForward();
      return;
    }
    this.blockedMustTurn();
    console.log('TR3: %o: Dir: %s', this.Position, this.Direction);
    this.recordAllHistory(this.Position);
    this.recordLookHistory();

    return this.Position;
  }

  recordMoveHistory(y, x, direction) {
    if (!y) y = this.Position.y;
    if (!x) x = this.Position.x;
    if (!direction) direction = this.Direction;
    this.moveHistory.push([y, x, direction]);
    //console.log('moveHistory: ', this.moveHistory);
  }
  recordLookHistory() {
    this.lookHistory.push([
      this.PotentialNewPosition.y,
      this.PotentialNewPosition.x,
      this.Direction,
    ]);
    //console.log('lookHistory: ', this.lookHistory);
  }
  recordLNMoveHistory() {
    this.LNMoveHistory.push([
      this.PotentialNewPosition.y,
      this.PotentialNewPosition.x,
      this.Direction,
    ]);
    //console.log('LNMoveHistory: ', this.LNMoveHistory);
  }
  recordAllHistory(pos) {
    this.allHistory.push([pos.y, pos.x, this.Direction]);
    //console.log('allhistory: ', this.allHistory);
  }

  moveForward() {
    let newPosVal;
    console.log('this.PotentialNewPosition.value=0(hc)');
    this.Position = this.PotentialNewPosition;
    this.recordAllHistory(this.Position);
    this.recordMoveHistory();
    newPosVal = ++this.moveCount;
    //map[this.Position.y][this.Position.x][0] = newPosVal;
    this.Position.isShoreline = newPosVal;
    map[this.Position.y][this.Position.x][1] = newPosVal;
    console.log('MF: %o: Dir: %s', this.Position, this.Direction);
  }
  blockedMustTurn() {
    let newPosVal;
    console.log('this.PotentialNewPosition=blocked(hc)');
    this.recordAllHistory(this.PotentialNewPosition);
    this.recordLNMoveHistory();
    newPosVal = ++this.moveCount;
    //map[this.Position.y][this.Position.x][0] = newPosVal;
    this.Position.isShoreline = newPosVal;
    map[this.Position.y][this.Position.x][1] = newPosVal;
    console.log('NO Move: %o: Dir: %s', this.Position, this.Direction);
  }
  numTimesVisited = (arr, arr2) => {
    let count = 0;
    let y = arr2[0];
    let x = arr2[1];
    let dir = arr2[2];
    this.moveHistory.forEach((move) => {
      if (move[0] === y && move[1] === x && move[2] === dir) {
        count++;
      }
    });
    return count;
  };
  didRevisitStartingPoint() {
    if (
      this.numTimesVisited(this.moveHistory, [
        this.InitialPosition.y,
        this.InitialPosition.x,
        this.InitialDirection,
      ]) < 2
    ) {
      return false;
    } else {
      return true;
    }
  }
}

//const map = getTestMapMatrix();
const map = generateMapMatrixGPT();
function mapShoreline() {
  console.log('map: ', map);
  const startingPoint = new TPoint(1, 2); // (y,x)
  var Avatar = new TAvatar(startingPoint, TDirection.East);
  Avatar.recordMoveHistory(
    Avatar.InitialPosition.y,
    Avatar.InitialPosition.x,
    Avatar.InitialDirection
  );

  let numMoves = 0;
  //while (!Avatar.didRevisitStartingPoint()) {
  while (numMoves < 30) {
    Avatar.Move();
    numMoves++;
  }
  console.log('numMoves: ', numMoves);
  console.log('allHistory: ', Avatar.allHistory);
  console.log('LNMoveHistory', Avatar.LNMoveHistory);
  console.log('lookHistory: ', Avatar.lookHistory);
  console.log('moveHistory: ', Avatar.moveHistory);

  return map;
}

export default mapShoreline;
