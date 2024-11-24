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
  anyNeighbors: { min: number; max: number }; // how many any plant neighbors inbetween min and max needed to grow
  sameNeighbors: { min: number; max: number }; // how many same plant neighbors inbetween min and max needed to grow
  diffNeighbors: { min: number; max: number }; // how many diff plant neighbors inbetween min and max needed to grow
}

export const PLANT_RULE: Record<number, PlantRule> = {
  1: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
  2: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
  3: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
  4: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
  5: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
  6: {
    sun: 1,
    water: 1,
    anyNeighbors: { min: -1, max: -1 },
    sameNeighbors: { min: -1, max: -1 },
    diffNeighbors: { min: -1, max: -1 },
  },
};
