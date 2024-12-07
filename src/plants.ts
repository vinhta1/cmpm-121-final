import type { Grid } from "./grid.ts";

const width = 10;
const height = 5;
export const PLANT_MAP: Record<number, { name: string; imageID: number }> = {
  1: { name: "turnip", imageID: 5 },
  2: { name: "radish", imageID: 10 },
  3: { name: "carrot", imageID: 15 },
  4: { name: "potato", imageID: 20 },
  5: { name: "onion", imageID: 25 },
  6: { name: "spinach", imageID: 30 },
};

// plant rules, if field set to -1, ignore rule.
export interface PlantRule {
  sun: number; // how much sun to grow next turn
  water: number; // how much water to grow next turn
  growthrate: number;
  anyNeighbors: { min: number; max: number }; // how many any plant neighbors inbetween min and max needed to grow
  sameNeighbors: { min: number; max: number }; // how many same plant neighbors inbetween min and max needed to grow
  diffNeighbors: { min: number; max: number }; // how many diff plant neighbors inbetween min and max needed to grow
}

export interface plant {
  growthCondition(grid: Grid, position: { x: number; y: number }): number;
}
function getSurroundingCells(x: number, y: number, grid: Grid) {
  const cells = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;
      const dX = x + i;
      const dY = y + j;
      if (dX >= 0 && dX < width && dY >= 0 && dY < height) {
        cells.push(grid.getCell(dX, dY));
      }
    }
  }
  return cells;
}

export const PLANT_RULE: Record<number, plant> = {
  1: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      const cell = grid.getCell(position.x, position.y);
      const growth = 1;
      if (cell.water - cell.sun > 0) {
        return growth * 1.5;
      } else {
        return growth;
      }
    },
  },
  2: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      const cell = grid.getCell(position.x, position.y);
      let growth = 1;
      if (cell.water >= 3) {
        growth *= 1.15;
      }
      if (cell.sun < 5 && cell.sun > 2) {
        growth *= 1.3;
      }
      return growth;
    },
  },
  3: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      const cell = grid.getCell(position.x, position.y);
      let growth = 1;
      if (cell.sun >= 4) {
        growth *= 1.3;
      }
      if (cell.water < 5 && cell.water > 2) {
        return (growth *= 1.15);
      }
      return growth;
    },
  },
  4: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      if (grid && position) return 1.25;
      else return 1;
    },
  },
  5: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      const cell = grid.getCell(position.x, position.y);
      const neighbors = getSurroundingCells(position.x, position.y, grid);
      let growth = 1;
      const samePlantNeighbors = neighbors.filter(
        (n) => n.plantID === cell.plantID
      );
      if (cell.sun >= 2) {
        growth *= 1.1;
      }
      if (cell.water < 5 && cell.water > 1) {
        growth *= 1.1;
      }
      if (samePlantNeighbors.length >= 1) {
        growth *= 1.5;
      }
      return growth;
    },
  },
  6: {
    growthCondition(grid: Grid, position: { x: number; y: number }) {
      const cell = grid.getCell(position.x, position.y);
      const neighbors = getSurroundingCells(position.x, position.y, grid);
      let growth = 1;
      const notPlantNeighbors = neighbors.filter((n) => n.plantID !== 0);
      const samePlantNeighbors = neighbors.filter(
        (n) => n.plantID === cell.plantID
      );
      if (notPlantNeighbors.length != samePlantNeighbors.length) {
        growth *= 0.25;
      }
      if (cell.water <= 4 && cell.water >= 2) {
        growth *= 1.25;
      }
      return growth;
    },
  },
};
