import * as r from "./renderer.ts";
import * as u from "./utility.ts";
import * as g from "./grid.ts";
import * as p from "./plants.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

const title: HTMLHeadingElement = document.createElement("h1");
title.id = "title";
title.innerHTML = "TEST";
app.appendChild(title);

const currentDay: HTMLDivElement = document.createElement("h2");
currentDay.innerHTML = "Day: 0";
app.appendChild(currentDay);

const turnButton: HTMLButtonElement = document.createElement("button");
turnButton.innerHTML = "Next Day";
app.appendChild(turnButton);

const canvasElement: HTMLDivElement = document.querySelector(
  "#canvas-container",
)!;
app.appendChild(canvasElement);

const tileInformation: HTMLElement = document.createElement("p");
app.appendChild(tileInformation);

const width = 10;
const height = 5;

const scale = 5;

canvasElement.style.width = `${width * u.TILE_SIZE * scale}px`;
canvasElement.style.height = `${height * u.TILE_SIZE * scale}px`;

const renderer = new r.P5Renderer(u.IMAGE_PATHS, scale);

const grid = new g.Grid(width, height);

let currentTurn = 0;

let playerX = 0;
let playerY = 0;

const playerReach = 1;

let outlineX = -1;
let outlineY = -1;

let outOfRange = false;

function initializeGrid() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      grid.setCell({
        x: j,
        y: i,
        plantID: 0,
        growthLevel: 0,
        sun: 0,
        water: 0,
        backgroundID: 2,
      });
    }
  }
}

function _setGridTestRandomPlants() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      grid.setCell({
        x: j,
        y: i,
        plantID: Math.floor(Math.random() * 7),
        growthLevel: Math.floor(Math.random() * 4),
        sun: -1,
        water: -1,
        backgroundID: -1,
      });
    }
  }
}

function newWeather() { // set the sun level and add to the water level
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      grid.setCell({
        x: j,
        y: i,
        plantID: -1,
        growthLevel: -1,
        sun: Math.floor(Math.random() * 9 + 1),
        water: grid.getCell(j, i).water + Math.floor(Math.random() * 5),
        backgroundID: -1,
      });
    }
  }
}

function updateCell(cell: g.GridCell, neighbors: g.GridCell[]) {
  if (cell.plantID == 0) {
    return;
  }
  const rule = p.PLANT_RULE[cell.plantID];
  if (cell.sun < rule.sun && rule.sun != -1) {
    return;
  }
  if (cell.water < rule.water && rule.water != -1) {
    return;
  }
  let all = 0;
  let same = 0;
  let diff = 0;
  neighbors.forEach((nCell) => {
    if (nCell.plantID != 0) {
      if (nCell.plantID == cell.plantID) {
        same++;
      }
      if (nCell.plantID != cell.plantID) {
        diff++;
      }
      all++;
    }
  });

  if (
    (all < rule.anyNeighbors.min && rule.anyNeighbors.min != -1) ||
    (all > rule.anyNeighbors.max && rule.anyNeighbors.max != -1)
  ) {
    return;
  }
  if (
    (same < rule.sameNeighbors.min && rule.sameNeighbors.min != -1) ||
    (same > rule.sameNeighbors.max && rule.sameNeighbors.max != -1)
  ) {
    return;
  }
  if (
    (diff < rule.diffNeighbors.min && rule.diffNeighbors.min != -1) ||
    (diff > rule.diffNeighbors.max && rule.diffNeighbors.max != -1)
  ) {
    return;
  }

  cell.water -= rule.water;
  cell.growthLevel = Math.min(cell.growthLevel + 1, 3);
  grid.setCell(cell);
}

function getSurroundingCells(x: number, y: number) {
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

function updateGrid() { // perform changes to the grid based on previous turn configuration
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      updateCell(grid.getCell(j, i), getSurroundingCells(j, i));
    }
  }
}

function tileOffset(n: number) {
  return n * u.TILE_SIZE + u.TILE_SIZE / 2;
}

function drawBackground() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      renderer.addImage(
        u.IMAGE_PATHS[grid.getCell(j, i).backgroundID],
        tileOffset(j),
        tileOffset(i),
        u.TILE_SIZE,
      );
    }
  }
}

function drawPlants() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid.getCell(j, i);
      if (cell.plantID == 0) {
        continue; //no plant
      }
      let plantImage: string = u.IMAGE_PATHS[1]; // seed
      if (cell.growthLevel > 0) {
        plantImage =
          u.IMAGE_PATHS[p.PLANT_MAP[cell.plantID].imageID + cell.growthLevel];
      }

      renderer.addImage(
        plantImage,
        tileOffset(j),
        tileOffset(i),
        u.TILE_SIZE,
      );
    }
  }
}

function drawOutline() {
  renderer.addImage(
    outOfRange ? u.IMAGE_PATHS[35] : u.IMAGE_PATHS[34],
    tileOffset(outlineX),
    tileOffset(outlineY),
    16,
  );
}

function drawPlayer() {
  renderer.addImage(
    u.IMAGE_PATHS[0],
    tileOffset(playerX),
    tileOffset(playerY),
    8,
  );
}

function displayCurrentTileInformation() {
  if (outlineX >= 0 && outlineX < width && outlineY >= 0 && outlineY < height) {
    const tile: g.GridCell = grid.getCell(outlineX, outlineY);
    tileInformation.innerHTML = `
    Tile: (${tile.x}, ${tile.y})<br>
    Sun: ${tile.sun}<br>
    Water: ${tile.water}<br>
    Plant: ${tile.plantID > 0 ? p.PLANT_MAP[tile.plantID].name : "None"}<br>
    Growth Level: ${tile.plantID > 0 ? tile.growthLevel : "None"}
    `;
  } else {
    tileInformation.innerHTML = "No Tile Selected";
  }
}

function refreshDisplay() {
  renderer.clear();
  drawBackground();
  drawPlants();
  drawOutline();
  drawPlayer();
  displayCurrentTileInformation();
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (u.KEY_MAP[key] == "up") {
    playerY--;
  }
  if (u.KEY_MAP[key] == "down") {
    playerY++;
  }
  if (u.KEY_MAP[key] == "left") {
    playerX--;
  }
  if (u.KEY_MAP[key] == "right") {
    playerX++;
  }
  playerX = u.clamp(playerX, width - 1, 0);
  playerY = u.clamp(playerY, height - 1, 0);

  outOfRange = false;
  if (
    u.distance(outlineX, outlineY, playerX, playerY) >
      Math.sqrt(2) * playerReach
  ) {
    outOfRange = true;
  }

  refreshDisplay();
});

document.addEventListener("mousemove", (e) => {
  const rect = canvasElement.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / (u.TILE_SIZE * scale));
  const y = Math.floor((e.clientY - rect.top) / (u.TILE_SIZE * scale));

  outOfRange = false;
  if (
    u.distance(x, y, playerX, playerY) >
      Math.sqrt(2) * playerReach
  ) {
    outOfRange = true;
  }

  if (outlineX != x || outlineY != y) {
    outlineX = x;
    outlineY = y;
    refreshDisplay();
  }
});

turnButton.addEventListener("click", () => {
  currentTurn++;
  currentDay.innerHTML = `Day: ${currentTurn}`;
  updateGrid();
  newWeather();
  refreshDisplay();
});

initializeGrid();
_setGridTestRandomPlants();
newWeather();
refreshDisplay();
