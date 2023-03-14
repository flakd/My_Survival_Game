import {getTestMapMatrix} from './setupMap';

let g = window;
const map = getTestMapMatrix();
class TPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.value = map[x][y];
  }
}

const TDirection = {
  North: Symbol('North'),
  East: Symbol('East'),
  South: Symbol('South'),
  West: Symbol('West'),
};

class TAvatar {
  Position;
  Direction;

  InitialPosition; //: TPoint;
  InitialDirection; //: TDirection

  PotentialNewPosition; //: TPoint
  constructor(dir, pos) {
    this.Direction = this.InitialDirection = dir;
    this.Position = this.InitialPosition = pos;
  }
  TurnRight(CurrentDirection) {
    if (CurrentDirection === TDirection.North) return TDirection.East;
    else if (CurrentDirection === TDirection.East) return TDirection.South;
    else if (CurrentDirection === TDirection.South) return TDirection.West;
    else return TDirection.North;
  }
  TurnLeft(CurrentDirection) {
    if (CurrentDirection === TDirection.North) return TDirection.West;
    else if (CurrentDirection === TDirection.West) return TDirection.South;
    else if (CurrentDirection === TDirection.South) return TDirection.East;
    else return TDirection.North;
  }

  getNextSquareForward(Position, dir) {
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

  Move() {
    this.Direction = this.TurnLeft(this.Direction);
    this.PotentialNewPosition = this.getNextSquareForward(
      this.Position,
      this.Direction
    );
    if (this.PotentialNewPosition.value === g.m.OCEAN) {
      this.Position = this.PotentialNewPosition;
      console.log(this.Position);
      return;
    }

    this.Direction = this.TurnRight(this.Direction);
    this.PotentialNewPosition = this.getNextSquareForward(
      this.Position,
      this.Direction
    );
    if ((this.PotentialNewPosition.value = g.m.OCEAN)) {
      this.Position = this.PotentialNewPosition;
      console.log(this.Position);
      return;
    }

    this.Direction = this.TurnRight(this.Direction);
    this.PotentialNewPosition = this.getNextSquareForward(
      this.Position,
      this.Direction
    );
    if ((this.PotentialNewPosition.value = g.m.OCEAN)) {
      this.Position = this.PotentialNewPosition;
      console.log(this.Position);
      return;
    }

    this.Direction = this.TurnRight(this.Direction);
    this.PotentialNewPosition = this.getNextSquareForward(
      this.Position,
      this.Direction
    );
    if ((this.PotentialNewPosition.value = g.m.OCEAN)) {
      this.Position = this.PotentialNewPosition;
      console.log(this.Position);
      return;
    }
  }
}

function mapLake() {
  let startingPoint = new TPoint(4, 2);
  var Avatar = new TAvatar(TDirection.East, startingPoint);
  Avatar.Move();
  let count = 0;
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  Avatar.Move();
  /*   while (Avatar.Position !== Avatar.InitialPosition || count > 100) {
    Avatar.Move();
    count++;
  } */
}

export default mapLake;
