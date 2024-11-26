export interface GridCell {
  x: number;
  y: number;
  plantID: number;
  growthLevel: number;
  sun: number;
  water: number;
  backgroundID: number;
}

const OFFSET = 7;

export class Grid {
  private _numCells: number;
  public get numCells(): number {
    return this._numCells;
  }
  public set numCells(value: number) {
    this._numCells = value;
  }
  private _buffer: ArrayBuffer;
  public get buffer(): ArrayBuffer {
    return this._buffer;
  }
  public set buffer(value: ArrayBuffer) {
    this._buffer = value;
  }
  private _viewer: Uint8Array;
  public get viewer(): Uint8Array {
    return this._viewer;
  }
  public set viewer(value: Uint8Array) {
    this._viewer = value;
  }
  //stores all the viewers in an array
  private _stateArray: Uint8Array[];
  public get stateArray(): Uint8Array[] {
    return this._stateArray;
  }
  public set stateArray(value: Uint8Array[]) {
    this._stateArray = value;
  }
  private _width: number;
  public get width(): number {
    return this._width;
  }
  public set width(value: number) {
    this._width = value;
  }

  constructor(width: number, height: number) {
    // Create an array buffer to store all cells. Cells are comprised of 7 uInt8, depicted in Interface GridCell
    this._numCells = width * height;
    this._buffer = new ArrayBuffer(this._numCells * OFFSET);
    this._viewer = new Uint8Array(this._buffer); //game state - everything except player location. will need array of this
    this._stateArray = [];
    this._width = width;

    let x = 0;
    let y = 0;
    for (let i = 0; i < this._numCells; i++) {
      this._viewer[i * OFFSET] = x;
      this._viewer[i * OFFSET + 1] = y;
      x == this._width - 1 ? (x = 0, y++) : x++;
      this._viewer[i * OFFSET + 2] = 0;
      this._viewer[i * OFFSET + 3] = 0;
      this._viewer[i * OFFSET + 4] = 0;
      this._viewer[i * OFFSET + 5] = 0;
      this._viewer[i * OFFSET + 6] = 0;
    }
  }
  public setCell(GridCell: GridCell) {
    const index = (GridCell.y * this._width + GridCell.x) * OFFSET;
    if (
      this._viewer[index] != GridCell.x || this._viewer[index + 1] != GridCell.y
    ) {
      throw new Error(
        `Buffer isn't lined up: input ${GridCell.x},${GridCell.y}, buffer ${
          this._viewer[index]
        },${this._viewer[index + 1]}`,
      );
    }
    if (GridCell.plantID >= 0) {
      this._viewer[index + 2] = GridCell.plantID;
    }
    if (GridCell.growthLevel >= 0) {
      this._viewer[index + 3] = GridCell.growthLevel;
    }
    if (GridCell.sun >= 0) {
      this._viewer[index + 4] = GridCell.sun;
    }
    if (GridCell.water >= 0) {
      this._viewer[index + 5] = GridCell.water;
    }
    if (GridCell.backgroundID >= 0) {
      this._viewer[index + 6] = GridCell.backgroundID;
    }
  }

  public getCell(x: number, y: number): GridCell {
    const index = (y * this._width + x) * OFFSET;
    if (this._viewer[index] != x || this._viewer[index + 1] != y) {
      throw new Error(
        `Buffer isn't lined up: input ${x},${y}, buffer ${
          this._viewer[index]
        },${this._viewer[index + 1]}`,
      );
    }
    return {
      x: this._viewer[index],
      y: this._viewer[index + 1],
      plantID: this._viewer[index + 2],
      growthLevel: this._viewer[index + 3],
      sun: this._viewer[index + 4],
      water: this._viewer[index + 5],
      backgroundID: this._viewer[index + 6],
    };
  }

  public gridChange(viewer: Uint8Array) {
    this.stateArray.push(viewer);
  }

  public stateToJSON() {
    return JSON.stringify({
      numCells: this._numCells,
      buffer: this._buffer,
      viewer: this._viewer,
      stateArray: this.stateArray,
      width: this._width,
    });
  }

  public static loadFromJSON(JSONFile: string) {
    const data = JSON.parse(JSONFile);
    const viewer = new Uint8Array(data.buffer);
    let stateArray = [];
    stateArray = data.stateArray;

    const grid = new Grid(data.width, data.numCells / data.width + 1);
    grid._viewer = viewer;
    grid._stateArray = stateArray;
    return grid;
  }
}
