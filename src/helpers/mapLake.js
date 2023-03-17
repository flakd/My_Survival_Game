import {getTestMapMatrix} from './setupMap';

let g = window;
const map = getTestMapMatrix();
class TPoint {
  constructor(x, y) {
    this.y = y;
    this.x = x;
    this.value = map[y][x];
    this.value.terrain = this.value[0];
    this.value.isShoreline = this.value[1];
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
  constructor(dir, pos) {
    this.Direction = this.InitialDirection = dir;
    this.Position = this.InitialPosition = pos;
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

  setNextPossMove() {
    this.PotentialNewPosition = getNextSquareForward(
      this.Position,
      this.Direction
    );
    return this.PotentialNewPosition;
    function getNextSquareForward(Position, dir) {
      let x, y;
      switch (dir) {
        case TDirection.North:
          x = Position.x;
          y = Position.y - 1;
          return new TPoint(x, y);
        case TDirection.East:
          x = Position.x + 1;
          y = Position.y;
          return new TPoint(x, y);
        case TDirection.South:
          x = Position.x;
          y = Position.y + 1;
          return new TPoint(x, y);
        case TDirection.West:
          x = Position.x - 1;
          y = Position.y;
          return new TPoint(x, y);
      }
    }
  }

  Move() {
    let newPosVal;
    console.log('TL: OldPos: %o: OldDir: %s', this.Position, this.Direction);
    this.TurnLeft();
    console.log('TL: OldPos: %o: NewDir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    console.log(
      'TL: NewPos: %o: NewDir: %s',
      this.PotentialNewPosition,
      this.Direction
    );
    this.recordLookHistory();

    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }

    this.TurnRight();
    console.log('TR1: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    console.log('TR1: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }

    this.TurnRight();
    console.log('TR2: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    console.log('TR2: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }

    this.TurnRight();
    console.log('TR3: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    console.log('TR3: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      console.log('this.PotentialNewPosition.value=0(hc)');
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }
    return this.Position;
  }

  recordStepHistory() {
    this.moveHistory.push([this.Position.y, this.Position.x]);
    console.log('moveHistory: ', this.moveHistory);
  }
  recordLookHistory() {
    this.lookHistory.push([
      this.PotentialNewPosition.y,
      this.PotentialNewPosition.x,
    ]);
    console.log('lookHistory: ', this.lookHistory);
  }
  recordLNMoveHistory() {
    this.LNMoveHistory.push([
      this.PotentialNewPosition.y,
      this.PotentialNewPosition.x,
    ]);
    console.log('LNMoveHistory: ', this.LNMoveHistory);
  }
  recordAllHistory(pos) {
    this.allHistory.push([pos.y, pos.x]);
    console.log('allhistory: ', this.allHistory);
  }

  moveForward() {
    let newPosVal;
    console.log('this.PotentialNewPosition.value=0(hc)');
    this.Position = this.PotentialNewPosition;
    this.recordAllHistory(this.Position);
    this.recordStepHistory();
    newPosVal = ++this.moveCount;
    //this.Position.value = newPosVal;
    //map[this.Position.y][this.Position.x] = newPosVal;
    this.Position.isShoreline = true;
    map[this.Position.y][this.Position.x][1] = newPosVal;
    console.log('MF: %o: Dir: %s', this.Position, this.Direction);
  }
  blockedMustTurn() {
    let newPosVal;
    console.log('this.PotentialNewPosition=blocked(hc)');
    this.recordAllHistory(this.PotentialNewPosition);
    this.recordLNMoveHistory();
    newPosVal = ++this.moveCount;
    //this.Position.value = newPosVal;
    //map[this.Position.y][this.Position.x] = newPosVal;
    this.Position.isShoreline = true;
    map[this.Position.y][this.Position.x][1] = newPosVal;
    console.log('NO Move: %o: Dir: %s', this.Position, this.Direction);
  }
  wasVisited(pos) {
    if (this.allHistory.includes([pos.y, pos.x])) return true;
  }
}

function mapShoreline() {
  const countInArray = (arr, arr2) => {
    let count = 0;
    let y = arr2[0];
    let x = arr2[1];
    arr.forEach((el) => {
      if (el[0] === y && el[1] === x) {
        count++;
      }
    });
    return count;
  };

  console.log('map', map);
  const startingPoint = new TPoint(2, 2); // (y,x)
  const start = [startingPoint.y, startingPoint.x];
  var Avatar = new TAvatar(TDirection.East, startingPoint);
  Avatar.moveHistory.push(start);

  let count = 0;
  while (countInArray(Avatar.moveHistory, start) < 2) {
    Avatar.Move();
    count++;
  }
  console.log('numMoves: ', count);

  return map;
}

export default mapShoreline;
