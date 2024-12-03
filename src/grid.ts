export interface GridCell {
  x: number;
  y: number;
  plantID: number;
  growthLevel: number;
  sun: number;
  water: number;
  backgroundID: number;
  age: number;
  planted: boolean;
}

const OFFSET = 9;

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
  private _width: number;
  public get width(): number {
    return this._width;
  }
  public set width(value: number) {
    this._width = value;
  }

  constructor(width: number, height: number) {
    // Create an array buffer to store all cells. Cells are comprised of 8 uInt8, depicted in Interface GridCell
    this._numCells = width * height;
    this._buffer = new ArrayBuffer(this.numCells * OFFSET);
    this._viewer = new Uint8Array(this.buffer);
    this._width = width;

    let x = 0;
    let y = 0;
    for (let i = 0; i < this.numCells; i++) {
      this.viewer[i * OFFSET] = x;
      this.viewer[i * OFFSET + 1] = y;
      x == this.width - 1 ? (x = 0, y++) : x++;
      this.viewer[i * OFFSET + 2] = 0;
      this.viewer[i * OFFSET + 3] = 0;
      this.viewer[i * OFFSET + 4] = 0;
      this.viewer[i * OFFSET + 5] = 0;
      this.viewer[i * OFFSET + 6] = 0;
      this.viewer[i * OFFSET + 7] = 0;
      this.viewer[i * OFFSET + 8] = 0;
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
      this.viewer[index + 6] = GridCell.backgroundID;
    }
    if (GridCell.age >= 0) {
      this.viewer[index + 7] = GridCell.age;
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
      x: this.viewer[index],
      y: this.viewer[index + 1],
      plantID: this.viewer[index + 2],
      growthLevel: this.viewer[index + 3],
      sun: this.viewer[index + 4],
      water: this.viewer[index + 5],
      backgroundID: this.viewer[index + 6],
      age: this.viewer[index + 7],
      planted: this.viewer[index + 8] === 1,
    };
  }

  public cloneGrid(): Uint8Array {
    // Clone the entire viewer (Uint8Array) and create a deep copy
    return new Uint8Array(this.viewer);
  }

  public restoreGrid(clonedState: Uint8Array) {
    if (clonedState.length !== this.viewer.length) {
      throw new Error("Incompatible grid size during restore!");
    }

    console.log("Restoring grid state...");
    this.viewer.set(clonedState); // Restore snapshot into the internal buffer

    // Log for debugging: Print all restored grid cells
    for (let y = 0; y < Math.floor(this.numCells / this.width); y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y);
        console.log(
          `Restored Cell (${x}, ${y}) - PlantID=${cell.plantID}, GrowthLevel=${cell.growthLevel}`,
        );
      }
    }
  }
}
