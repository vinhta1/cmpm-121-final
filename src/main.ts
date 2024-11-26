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

const plantOptions: HTMLDivElement = document.createElement("div");
app.appendChild(plantOptions);

const canvasElement: HTMLDivElement =
  document.querySelector("#canvas-container")!;
app.appendChild(canvasElement);

const tileInformation: HTMLElement = document.createElement("p");
app.appendChild(tileInformation);

const width = 10;
const height = 5;

const scale = 5;

let harvestCount = 0;

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

let currentPlant = 1;

function initializeGrid() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid.getCell(j, i);
      cell.backgroundID = 2;
      grid.setCell(cell);
    }
  }
}

function _setGridTestRandomPlants() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid.getCell(j, i);
      cell.plantID = Math.floor(Math.random() * 7);
      cell.growthLevel = Math.floor(Math.random() * 4);
      cell.age = 0;
      grid.setCell(cell);
    }
  }
}

// if certain squares are near each other (like 3) plants do grow

// if harvest certain amount plants like 10

function createPlantOptionButton(plantID: number) {
  const button = document.createElement("button");
  button.innerHTML = p.PLANT_MAP[plantID].name;
  button.addEventListener("click", () => {
    currentPlant = plantID;
  });
  plantOptions.appendChild(button);
}

function clickCell() {
  if (outOfRange) return;

  const cell = grid.getCell(outlineX, outlineY);

  // CASE 1: If the plant is fully grown, harvest it and leave the cell empty
  if (cell.plantID > 0 && cell.growthLevel === 3) {
    console.log(`Harvested plant at (${cell.x}, ${cell.y})!`);

    //handleHarvest(cell.plantID);

    cell.plantID = 0; // Remove the plant
    cell.growthLevel = 0; // Reset growth level
    cell.age = 0;
    cell.sun = 0;
    cell.water = 0;

    // CASE 2: If the player clicks on an empty cell, allow planting a new crop
  } else if (cell.plantID === 0) {
    cell.plantID = currentPlant;
  } else {
    cell.plantID = 0;
  }
  grid.setCell(cell);
  refreshDisplay();
}

function newWeather() { // set the sun level and add to the water level
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid.getCell(j, i);
      cell.sun = Math.floor(Math.random() * 9 + 1);
      cell.water = cell.water + Math.floor(Math.random() * 5);
      grid.setCell(cell);
    }
  }
}

function updateCell(cell: g.GridCell, neighbors: g.GridCell[]) {
  if (cell.plantID == 0) return; // Skip empty cells.

  const plantRule = p.PLANT_RULE[cell.plantID];
  if (!plantRule) return; // Skip if no growth rule exists.

  const samePlantNeighbors = neighbors.filter((n) =>
    n.plantID === cell.plantID
  );
  let adjustedGrowthRate = plantRule.growthrate;

  // **Step 1: Adjust for Neighbor Conditions**
  if (samePlantNeighbors.length >= 1 && samePlantNeighbors.length <= 2) {
    const neighborBoostMultiplier = 1.5;
    adjustedGrowthRate *= neighborBoostMultiplier;
  } else if (samePlantNeighbors.length >= 3) {
    const competitionFactor = 2; // Halve growth rate.
    adjustedGrowthRate /= competitionFactor;
  }

  if (cell.sun > 5) {
    const sunBoostMultiplier = 1.1; // 10% boost for enough sun energy.
    adjustedGrowthRate *= sunBoostMultiplier;
    console.log("sun boost", adjustedGrowthRate);
  }

  if (cell.water >= 5) {
    const waterBoostMultiplier = 1.05; // 5% boost for water sufficiency.
    adjustedGrowthRate *= waterBoostMultiplier;
    console.log("water boost", adjustedGrowthRate);
    cell.water -= 1; // Absorb 1 unit of water per turn.
  }

  cell.age++;

  const requiredTurnsPerStage = 1 / adjustedGrowthRate;
  const progress = cell.age / requiredTurnsPerStage;
  cell.growthLevel = Math.min(Math.floor(progress), 3); // Maximum level = 3.

  grid.setCell(cell);

  console.log(
    `Cell (${cell.x},${cell.y}) - PlantID: ${cell.plantID}, Same Neighbors: ${samePlantNeighbors.length}, Sun: ${cell.sun}, Water: ${
      cell.water.toFixed(1)
    }, Adjusted GrowthRate: ${
      adjustedGrowthRate.toFixed(2)
    }, GrowthLevel: ${cell.growthLevel}`,
  );
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
  console.log("Updating grid for a new turn...");
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
        u.TILE_SIZE
      );
    }
  }
}

function drawPlants() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const cell = grid.getCell(j, i);
      if (cell.plantID == 0) continue; // Skip empty cells

      // Display based on the current growth level
      let plantImage: string = u.IMAGE_PATHS[1]; // Default to seed
      if (cell.growthLevel > 0) {
        plantImage =
          u.IMAGE_PATHS[p.PLANT_MAP[cell.plantID].imageID + cell.growthLevel];
      }

      renderer.addImage(
        plantImage,
        tileOffset(j), // Horizontal position
        tileOffset(i), // Vertical position
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
    16
  );
}

function drawPlayer() {
  renderer.addImage(
    u.IMAGE_PATHS[0],
    tileOffset(playerX),
    tileOffset(playerY),
    8
  );
}

function displayCurrentTileInformation() {
  if (outlineX >= 0 && outlineX < width && outlineY >= 0 && outlineY < height) {
    const tile: g.GridCell = grid.getCell(outlineX, outlineY);

    //const plantRule = p.PLANT_RULE[tile.plantID];
    const progress = ((tile.growthLevel / 3) * 100).toFixed(2);

    tileInformation.innerHTML = `
      Tile: (${tile.x}, ${tile.y})<br>
      Sun: ${tile.sun}<br>
      Water: ${tile.water}<br>
      Plant: ${tile.plantID > 0 ? p.PLANT_MAP[tile.plantID].name : "None"}<br>
      Growth Level: ${tile.plantID > 0 ? tile.growthLevel : "None"}<br>
      Progress: ${progress}%
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
  if (u.distance(x, y, playerX, playerY) > Math.sqrt(2) * playerReach) {
    outOfRange = true;
  }

  if (outlineX != x || outlineY != y) {
    outlineX = x;
    outlineY = y;
    refreshDisplay();
  }
});

canvasElement.addEventListener("click", clickCell);

turnButton.addEventListener("click", () => {
  currentTurn++;
  currentDay.innerHTML = `Day: ${currentTurn}`;
  updateGrid();
  newWeather();
  refreshDisplay();
});

for (let i = 1; i <= 6; i++) {
  createPlantOptionButton(i);
}
initializeGrid();
newWeather();
refreshDisplay();
