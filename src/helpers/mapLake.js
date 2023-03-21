import {getTestMapMatrix, genInitMapMatrix} from './setupMap';

let g = window;
//const map = genInitMapMatrix();
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

g.m.TDirection = {
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
      if (currrenDirection === g.m.TDirection.North) return g.m.TDirection.East;
      else if (currrenDirection === g.m.TDirection.East)
        return g.m.TDirection.South;
      else if (currrenDirection === g.m.TDirection.South)
        return g.m.TDirection.West;
      else return g.m.TDirection.North;
    }
    return this.Direction;
  }
  TurnLeft() {
    this.Direction = TL(this.Direction);
    function TL(currrenDirection) {
      if (currrenDirection === g.m.TDirection.North) return g.m.TDirection.West;
      else if (currrenDirection === g.m.TDirection.West)
        return g.m.TDirection.South;
      else if (currrenDirection === g.m.TDirection.South)
        return g.m.TDirection.East;
      else return g.m.TDirection.North;
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
        case g.m.TDirection.North:
          x = Position.x;
          y = Position.y - 1;
          return new TPoint(x, y);
        case g.m.TDirection.East:
          x = Position.x + 1;
          y = Position.y;
          return new TPoint(x, y);
        case g.m.TDirection.South:
          x = Position.x;
          y = Position.y + 1;
          return new TPoint(x, y);
        case g.m.TDirection.West:
          x = Position.x - 1;
          y = Position.y;
          return new TPoint(x, y);
      }
    }
  }

  Move() {
    let newPosVal;
    //console.log('TL: OldPos: %o: OldDir: %s', this.Position, this.Direction);
    this.TurnLeft();
    //console.log('TL: OldPos: %o: NewDir: %s', this.Position, this.Direction);
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
    //console.log('TR1: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    //console.log('TR1: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }

    this.TurnRight();
    //console.log('TR2: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    //console.log('TR2: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }

    this.TurnRight();
    //console.log('TR3: %o: Dir: %s', this.Position, this.Direction);
    this.setNextPossMove();
    this.recordLookHistory();

    //console.log('TR3: %o: Dir: %s', this.PotentialNewPosition, this.Direction);
    if (this.PotentialNewPosition.value.terrain === g.m.OCEAN) {
      console.log('this.PotentialNewPosition.value=0(hc)');
      this.moveForward();
      return;
    } else {
      this.blockedMustTurn();
    }
    return this.Position;
  }

  recordMoveHistory() {
    this.moveHistory.push([this.Position.x, this.Position.y, this.Direction]);
    //console.log('moveHistory: ', this.moveHistory);
  }
  recordLookHistory() {
    this.lookHistory.push([
      this.PotentialNewPosition.x,
      this.PotentialNewPosition.y,
      this.Direction,
    ]);
    //console.log('lookHistory: ', this.lookHistory);
  }
  recordLNMoveHistory() {
    this.LNMoveHistory.push([
      this.PotentialNewPosition.x,
      this.PotentialNewPosition.y,
      this.Direction,
    ]);
    //console.log('LNMoveHistory: ', this.LNMoveHistory);
  }
  recordAllHistory(pos, dir) {
    this.allHistory.push([pos.x, pos.y, dir]);
    //console.log('allhistory: ', this.allHistory);
  }

  moveForward() {
    let newPosVal;
    console.log('this.PotentialNewPosition.value=0(hc)');
    this.Position = this.PotentialNewPosition;
    this.recordAllHistory(this.Position, this.Direction);
    this.recordMoveHistory();
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
    this.recordAllHistory(this.PotentialNewPosition, this.Direction);
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
  const countInHistory = (history, startArr) => {
    let count = 0;
    let y = startArr[0];
    let x = startArr[1];
    let dir = startArr[2];
    history.forEach((el) => {
      if (el[0] === y && el[1] === x && el[2] === dir) {
        count++;
      }
    });
    return count;
  };

  console.log('map', map);
  const startingPoint = new TPoint(3, 2); // (x,y)  ??  - I thought it was y,x
  const startingDirection = g.m.TDirection.East;
  var Avatar = new TAvatar(startingDirection, startingPoint);
  const start = [
    Avatar.InitialPosition.x,
    Avatar.InitialPosition.y,
    Avatar.InitialDirection,
  ];
  Avatar.moveHistory.push(start);

  let count = 0;
  while (countInHistory(Avatar.moveHistory, start) < 2) {
    //while (count < 20) {
    Avatar.Move();
    console.log('numMoves: ', count);
    console.log('allhistory: ', Avatar.allHistory);
    console.log('moveHistory: ', Avatar.moveHistory);
    console.log('lookHistory: ', Avatar.lookHistory);
    console.log('LNMoveHistory: ', Avatar.LNMoveHistory);
    count++;
  }

  return map;
}

export default mapShoreline;
