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
  private buffer: ArrayBuffer;
  private viewer: Uint8Array;
  private numCells: number;
  private width: number;

  constructor(width: number, height: number) {
    // Create an array buffer to store all cells. Cells are comprised of 7 uInt8, depicted in Interface GridCell
    this.numCells = width * height;
    this.buffer = new ArrayBuffer(this.numCells * OFFSET);
    this.viewer = new Uint8Array(this.buffer);
    this.width = width;

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
    }
  }
  public setCell(GridCell: GridCell) {
    const index = (GridCell.y * this.width + GridCell.x) * OFFSET;
    if (
      this.viewer[index] != GridCell.x || this.viewer[index + 1] != GridCell.y
    ) {
      throw new Error(
        `Buffer isn't lined up: input ${GridCell.x},${GridCell.y}, buffer ${
          this.viewer[index]
        },${this.viewer[index + 1]}`,
      );
    }
    if (GridCell.plantID >= 0) {
      this.viewer[index + 2] = GridCell.plantID;
    }
    if (GridCell.growthLevel >= 0) {
      this.viewer[index + 3] = GridCell.growthLevel;
    }
    if (GridCell.sun >= 0) {
      this.viewer[index + 4] = GridCell.sun;
    }
    if (GridCell.water >= 0) {
      this.viewer[index + 5] = GridCell.water;
    }
    if (GridCell.backgroundID >= 0) {
      this.viewer[index + 6] = GridCell.backgroundID;
    }
  }

  public getCell(x: number, y: number): GridCell {
    const index = (y * this.width + x) * OFFSET;
    if (this.viewer[index] != x || this.viewer[index + 1] != y) {
      throw new Error(
        `Buffer isn't lined up: input ${x},${y}, buffer ${this.viewer[index]},${
          this.viewer[index + 1]
        }`,
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
    };
  }
}
