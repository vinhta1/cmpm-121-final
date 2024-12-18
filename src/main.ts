import * as r from "./renderer.ts";
import * as u from "./utility.ts";
import * as g from "./grid.ts";
import * as p from "./plants.ts";
import * as l from "./localization.ts";
import * as s from "./scenario.ts";

const bgm01URL = new URL("/src/assets/audio/BGM01.mp3", import.meta.url).href;
const bgm02URL = new URL("/src/assets/audio/BGM02.mp3", import.meta.url).href;
const bgm03URL = new URL("/src/assets/audio/BGM03.mp3", import.meta.url).href;
const bgm01 = new Audio(bgm01URL);
const bgm02 = new Audio(bgm02URL);
const bgm03 = new Audio(bgm03URL);
const bgmList = [bgm01, bgm02, bgm03];
let bgmPlaying = false;
bgmList.forEach((bgm) => {
  bgm.addEventListener("ended", () => {
    bgmPlaying = false;
  });
});

const plantSFXURL = new URL("/src/assets/audio/PlantSFX.mp3", import.meta.url)
  .href;
const harvestSFXURL = new URL(
  "/src/assets/audio/HarvestSFX.mp3",
  import.meta.url
).href;
const winSFXURL = new URL("/src/assets/audio/WinSFX.mp3", import.meta.url).href;
const plantSFX = new Audio(plantSFXURL);
const harvestSFX = new Audio(harvestSFXURL);
harvestSFX.volume = 0.5;
const winSFX = new Audio(winSFXURL);

const loc: l.Localization = l.getCurrentLocalization();

const app = document.querySelector<HTMLDivElement>("#app")!;

const title: HTMLHeadingElement = document.createElement("h1");
title.id = "title";
title.innerHTML = loc["title"];
app.appendChild(title);

const p5CheckText: HTMLDivElement = document.createElement("h4");
p5CheckText.innerHTML = loc["useP5"];
app.appendChild(p5CheckText);

const p5Check: HTMLInputElement = document.createElement("input");
p5Check.type = "checkbox";
p5Check.checked = true;
p5CheckText.appendChild(p5Check);

const reqText: HTMLDivElement = document.createElement("h3");
reqText.innerHTML = `${loc["req"]}: ${s.getWinCon()}`;
app.appendChild(reqText);

const winText: HTMLDivElement = document.createElement("h1");
winText.innerHTML = "";
winText.style.color = "green";
winText.style.fontSize = "50px";
winText.style.left = "200px"; // X-coordinate
winText.style.top = "500px"; // Y-coordinate

app.appendChild(winText);

const currentDay: HTMLDivElement = document.createElement("h2");
currentDay.innerHTML = `${loc["day"]}: 0`;
app.appendChild(currentDay);

const turnButton: HTMLButtonElement = document.createElement("button");
turnButton.innerHTML = loc["nextDay"];
app.appendChild(turnButton);

const moveOptions: HTMLDivElement = document.createElement("div");
app.appendChild(moveOptions);

// work on these next
const direct = ["up", "down", "left", "right"];
direct.forEach((direction) => createDirectionButton(direction));

const plantOptions: HTMLDivElement = document.createElement("div");
app.appendChild(plantOptions);

const canvasElement: HTMLDivElement =
  document.querySelector("#canvas-container")!;
app.appendChild(canvasElement);

const tileInformation: HTMLElement = document.createElement("p");
app.appendChild(tileInformation);

function refreshUI() {
  const loc = l.getCurrentLocalization(); // Fetch the active localization
  title.innerHTML = loc.title;
  currentDay.innerHTML = `${loc.day}: ${currentTurn}`;
  undoButton.innerHTML = loc.undo;
  redoButton.innerHTML = loc.redo;
  turnButton.innerHTML = loc.nextDay;

  if (checkWinCondition()) {
    winText.innerHTML = loc.win; // Display the localized win message
    reqText.innerHTML = "";
  } else {
    winText.innerHTML = ""; // Clear the win message if the condition is not met
    reqText.innerHTML = `${loc["req"]}: ${s.getWinCon()}`;
  }

  moveOptions.innerHTML = ""; // Clear existing buttons
  const directions = ["up", "down", "left", "right"]; // Standard directions
  directions.forEach((direction) => createDirectionButton(direction)); // Create localized buttons

  p5CheckText.innerHTML = loc.useP5;
  p5CheckText.appendChild(p5Check);

  plantOptions.innerHTML = ""; // Clear existing buttons
  for (let plantID = 1; plantID <= 6; plantID++) {
    createPlantOptionButton(plantID); // Recreate buttons with current localization
  }

  // Update tile information if applicable
  displayCurrentTileInformation(); // Use localized values for tiles
  renderSaveManager();
}

const languageSelector = document.createElement("select");
languageSelector.innerHTML = `
 <option value="English">English</option>
 <option value="Emoji">😃</option>
 <option value="Spanish">Español</option>
 <option value="Cantonese">廣州話</option>
 <option value="Arabic">عربي</option>
`;
languageSelector.addEventListener("change", (e) => {
  const selectedLang = (e.target as HTMLSelectElement).value as
    | "English"
    | "Emoji"
    | "Spanish"
    | "Cantonese"
    | "Arabic";
  l.switchLanguage(selectedLang);
  refreshUI(); // Refresh the UI to reflect the new language
});
document.body.appendChild(languageSelector);

const width = 10;
const height = 5;

const scale = 5;

let undoStack: Array<Uint8Array> = [];
let redoStack: Array<Uint8Array> = [];

canvasElement.style.width = `${width * u.TILE_SIZE * scale}px`;
canvasElement.style.height = `${height * u.TILE_SIZE * scale}px`;

let renderer: r.Renderer;
if (p5Check.checked) {
  renderer = new r.P5Renderer(u.IMAGE_PATHS, scale);
} else {
  renderer = new r.JSRenderer(u.IMAGE_PATHS, scale);
}

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

const gameInventory: Record<string, number> = {}; // A simple global object to track collected produce

function handleHarvest(plantID: number) {
  playRandomBGM();
  const plantName = p.PLANT_MAP[plantID].name;

  // Add the harvested plant to the player's inventory
  if (!gameInventory[plantName]) {
    gameInventory[plantName] = 0; // Initialize inventory for the plant
  }
  gameInventory[plantName]++;
  console.log(`Added 1 ${plantName} to your inventory!`);
  console.log("Current Inventory:", gameInventory);

  checkWinCondition();
  refreshUI();
}

export function checkWinCondition() {
  //can be used to keep track of win conditions across levels
  const totalHarvested = Object.keys(gameInventory).reduce(
    (sum, key) => sum + gameInventory[key],
    0
  );

  if (totalHarvested >= s.getWinCon()) {
    console.log("Win condition met!");
    winSFX.play();
    return true;
  }
  return false;
}

function createPlantOptionButton(plantID: number) {
  const loc = l.getCurrentLocalization();
  const button = document.createElement("button");
  button.innerHTML = loc[p.PLANT_MAP[plantID].name as keyof l.Localization];
  button.addEventListener("click", () => {
    currentPlant = plantID;
  });
  plantOptions.appendChild(button);
}

function createDirectionButton(direction: string) {
  const loc = l.getCurrentLocalization();
  const localizedLabel = loc[`direction${direction}` as keyof l.Localization];

  const button = document.createElement("button");
  button.innerHTML = localizedLabel;
  button.addEventListener("click", () => {
    move(direction);
  });
  moveOptions.appendChild(button);
}

function clickCell() {
  if (outOfRange) return;
  saveStateToUndoStack(grid);

  const cell = grid.getCell(outlineX, outlineY);

  // CASE 1: If the plant is fully grown, harvest it and leave the cell empty
  if (cell.plantID > 0 && cell.growthLevel === 3) {
    console.log(`Harvested plant at (${cell.x}, ${cell.y})!`);
    console.log(cell.plantID);

    handleHarvest(cell.plantID);
    harvestSFX.play();

    cell.plantID = 0; // Remove the plant
    cell.growthLevel = 0; // Reset growth level
    cell.age = 0;
    cell.sun = 0;
    cell.water = 0;

    // CASE 2: If the player clicks on an empty cell, allow planting a new crop
  } else if (cell.plantID === 0) {
    cell.plantID = currentPlant;
    cell.growthLevel = 0;
    //cell.age = 0;
    //cell.water = 0;

    plantSFX.play();
  }
  grid.setCell(cell);
  refreshDisplay();
}

const undoButton = document.createElement("button");
undoButton.innerHTML = loc["undo"];
undoButton.addEventListener("click", () => {
  if (undoStack.length > 0) {
    undo(grid);
    currentTurn--; // Update the turn counter for redo
    if (currentTurn < 0) {
      currentTurn = 0;
    }
  }
  currentDay.innerHTML = `${loc["day"]}: ${currentTurn}`; // Update the day display
});
app.appendChild(undoButton);

const redoButton = document.createElement("button");
redoButton.innerHTML = loc["redo"];
redoButton.addEventListener("click", () => {
  if (redoStack.length > 0) {
    redo(grid);
    currentTurn++;
    if (currentTurn < 0) {
      currentTurn = 0;
    } else if (currentTurn > undoStack.length) {
      currentTurn = undoStack.length - 1;
    }
  }
  currentDay.innerHTML = `${loc["day"]}: ${currentTurn}`; // Update the day display
});
app.appendChild(redoButton);

function saveStateToUndoStack(grid: g.Grid) {
  const snapshot = grid.cloneGrid();
  undoStack.push(snapshot);
  redoStack = [];
  console.log(
    "State saved to undoStack. Current undo stack size:",
    undoStack.length
  );
}

function undo(grid: g.Grid) {
  if (undoStack.length > 0) {
    console.log("Restoring grid state...");
    const currentState = grid.cloneGrid();
    redoStack.push(currentState);

    const previousState = undoStack.pop();
    grid.restoreGrid(previousState!);

    // Check restored sun and water values
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = grid.getCell(j, i);
        console.log(
          `Restored cell (${j}, ${i}) - Sun: ${cell.sun}, Water: ${cell.water}`
        );
      }
    }

    refreshDisplay();
  } else {
    console.log("No actions to undo!");
  }
}

function redo(grid: g.Grid) {
  if (redoStack.length > 0) {
    console.log("Redo: Restoring next grid state...");

    const currentState = grid.cloneGrid();
    undoStack.push(currentState);

    const nextState = redoStack.pop();
    grid.restoreGrid(nextState!);

    console.log(
      `Redo complete. UndoStack size: ${undoStack.length}, RedoStack size: ${redoStack.length}.`
    );

    refreshDisplay();
  } else {
    console.log("No actions to redo!");
  }
}

export function newWeather() {
  // set the sun level and add to the water level
  const customWeather = s.weatherCheck(currentTurn);
  if (customWeather != "none") {
    const weather = s.getWeather(customWeather);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = grid.getCell(j, i);
        cell.sun = weather.sunChange;
        cell.water = weather.waterChange;
        grid.setCell(cell);
      }
    }
  } else {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const cell = grid.getCell(j, i);
        cell.sun = Math.floor(Math.random() * 9 + 1);
        cell.water = cell.water + Math.floor(Math.random() * 5);
        grid.setCell(cell);
      }
    }
  }
}

function updateCell(cell: g.GridCell) {
  if (cell.plantID == 0) return; // Skip empty cells.

  const plantRule = p.PLANT_RULE[cell.plantID];
  const canGrow = plantRule.growthCondition(grid, { x: cell.x, y: cell.y });
  cell.age++;
  if (canGrow < 1) return; // Skip if no growth rule exists.
  const adjustedGrowthRate = canGrow;
  cell.age++;
  const requiredTurnsPerStage = adjustedGrowthRate;
  const progress = cell.age * requiredTurnsPerStage;
  const originalGrowth = cell.growthLevel;
  cell.growthLevel = Math.min(Math.floor(progress), 3); // Maximum level = 3.
  if (originalGrowth > cell.growthLevel) {
    cell.growthLevel = originalGrowth;
  }
  if (cell.water > 0) cell.water -= 1;

  grid.setCell(cell);
}

function updateGrid() {
  // perform changes to the grid based on previous turn configuration

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      updateCell(grid.getCell(j, i));
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

      let plantImage: string = u.IMAGE_PATHS[cell.growthLevel + 1]; // Default to seed
      if (cell.growthLevel > 0) {
        plantImage =
          u.IMAGE_PATHS[p.PLANT_MAP[cell.plantID].imageID + cell.growthLevel];
      }

      renderer.addImage(
        plantImage,
        tileOffset(j), // Horizontal position
        tileOffset(i), // Vertical position
        u.TILE_SIZE
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
    16
  );
}

function displayCurrentTileInformation() {
  const loc = l.getCurrentLocalization();
  if (outlineX >= 0 && outlineX < width && outlineY >= 0 && outlineY < height) {
    const tile: g.GridCell = grid.getCell(outlineX, outlineY);

    //const plantRule = p.PLANT_RULE[tile.plantID];
    const progress = ((tile.growthLevel / 3) * 100).toFixed(2);

    tileInformation.innerHTML = `
     ${loc["tile"]}: (${tile.x}, ${tile.y})<br>
     ${loc["sun"]}: ${tile.sun}<br>
     ${loc["water"]}: ${tile.water}<br>
     ${loc["plant"]}: ${
      tile.plantID > 0
        ? loc[p.PLANT_MAP[tile.plantID].name as keyof l.Localization]
        : loc["none"]
    }<br>
     ${loc["growthLevel"]}: ${
      tile.plantID > 0 ? tile.growthLevel : loc["none"]
    }<br>
     ${loc["progress"]}: ${progress}%
   `;
  } else {
    tileInformation.innerHTML = loc["nothing"];
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

function saveGame() {
  const undoStackSerialized: string[] = undoStack.map(grid.serializeArray);
  const redoStackSerialized: string[] = redoStack.map(grid.serializeArray);

  const currentState: string = grid.serializeArray(grid.cloneGrid());

  return [
    currentState,
    JSON.stringify(undoStackSerialized),
    JSON.stringify(redoStackSerialized),
  ];
}

function loadGame(data: [string, string, string]) {
  const undoStackSerialized: string[] = JSON.parse(data[1]);
  const redoStackSerialized: string[] = JSON.parse(data[2]);

  grid.restoreGrid(grid.deserializeArray(data[0]));
  undoStack = undoStackSerialized.map(grid.deserializeArray);
  redoStack = redoStackSerialized.map(grid.deserializeArray);

  refreshDisplay();
}

function move(direction: string) {
  if (u.KEY_MAP[direction] == "up" || direction == "up") {
    playerY--;
  }
  if (u.KEY_MAP[direction] == "down" || direction == "down") {
    playerY++;
  }
  if (u.KEY_MAP[direction] == "left" || direction == "left") {
    playerX--;
  }
  if (u.KEY_MAP[direction] == "right" || direction == "right") {
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
}

function playRandomBGM() {
  if (!bgmPlaying) {
    console.log("bgm playing now");
    bgmList[Math.floor(Math.random() * bgmList.length)].play();
    bgmPlaying = true;
  }
}

globalThis.addEventListener("beforeunload", () => {
  //const autoSave: string[] = saveGame();
  //localStorage.setItem("autosave",JSON.stringify(autoSave))
  const loc = l.getCurrentLocalization(); // Dynamically fetch localization
  saveGameToSlot(loc["gameSave"]);
});

globalThis.addEventListener("load", () => {
  const loc = l.getCurrentLocalization();
  const autoKeySave = loc["gameSave"];
  try {
    const autosave = localStorage.getItem(autoKeySave);
    if (autosave) {
      if (confirm(loc["autoSavePrompt"])) {
        const savePayload = JSON.parse(autosave);
        loadGame(savePayload.data); // Load the autosave data
        console.log("Autosave loaded successfully.");
      } else {
        console.log("Player chose not to load the autosave.");
      }
    } else {
      console.log("No autosave found.");
    }
  } catch (error) {
    console.error("Error loading autosave:", error);
  }
});

function saveGameToSlot(slotName: string) {
  const savedData = saveGame(); // Assume this gathers save data like in your previous code
  const savePayload = {
    timestamp: new Date().toISOString(),
    data: savedData, // Your saveGame format, e.g., [currentState, undoStack, redoStack]
  };
  localStorage.setItem(slotName, JSON.stringify(savePayload));
  console.log(`Game saved to slot: ${slotName}`);
}

function loadGameFromSlot(slotName: string) {
  const savedDataString = localStorage.getItem(slotName);
  if (!savedDataString) {
    console.error(`No save found in slot: ${slotName}`);
    return;
  }

  const savePayload = JSON.parse(savedDataString);
  loadGame(savePayload.data); // Assume your `loadGame` function is prepared for this format
  console.log(`Game loaded from slot: ${slotName}`);
}

function deleteSaveSlot(slotName: string) {
  localStorage.removeItem(slotName);
  console.log(`Save slot deleted: ${slotName}`);
}

function renderSaveManager() {
  const saveManager = document.getElementById("save-manager");
  const loc = l.getCurrentLocalization();
  saveManager!.innerHTML = ""; // Clear existing UI

  // Get all save slots from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Only display items that are game saves
    if (key && key.startsWith("gameSave")) {
      const savePayload = JSON.parse(localStorage.getItem(key)!);
      const saveSlot = document.createElement("div");
      saveSlot.style.margin = "10px 0";

      // Display slot info
      saveSlot.innerHTML = `
        <strong>${key}</strong><br>
        ${loc["savedAt"]}: ${new Date(savePayload.timestamp).toLocaleString()}
      `;

      // Add Load button
      const loadButton = document.createElement("button");
      loadButton.innerText = loc["load"];
      loadButton.addEventListener("click", () => loadGameFromSlot(key));
      saveSlot.appendChild(loadButton);

      // Add Delete button
      const deleteButton = document.createElement("button");
      deleteButton.innerText = loc["delete"];
      deleteButton.addEventListener("click", () => {
        if (confirm(`${loc["deleteConfirm"]}: ${key}?`)) {
          deleteSaveSlot(key);
          renderSaveManager(); // Update the UI after deletion
        }
      });
      saveSlot.appendChild(deleteButton);

      saveManager!.appendChild(saveSlot);
    }
  }

  // Add Save Button for New Slot
  const newSaveButton = document.createElement("button");
  newSaveButton.innerText = loc["newSaveSlot"];
  newSaveButton.addEventListener("click", () => {
    const saveName = prompt(loc["enterSaveName"]);
    if (saveName) {
      const slotName = `gameSave_${saveName}`;
      if (localStorage.getItem(slotName)) {
        if (!confirm(`${loc["overwriteConfirm"]}: "${slotName}"?`)) return;
      }
      saveGameToSlot(slotName);
      renderSaveManager(); // Update UI after saving
    }
  });
  saveManager!.appendChild(newSaveButton);
}

// Initialize the save manager interface
document.addEventListener("DOMContentLoaded", () => {
  const saveManagerContainer = document.createElement("div");
  saveManagerContainer.id = "save-manager";
  document.body.appendChild(saveManagerContainer);

  renderSaveManager(); // Render when the page loads
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  move(key);
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
  currentDay.innerHTML = `${loc["day"]} ${currentTurn}`;
  saveStateToUndoStack(grid);
  updateGrid();
  newWeather();
  refreshUI();
  refreshDisplay();
});

p5Check.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  canvasElement.innerHTML = "";
  if (target.checked) {
    renderer = new r.P5Renderer(u.IMAGE_PATHS, scale);
  } else {
    renderer = new r.JSRenderer(u.IMAGE_PATHS, scale);
  }
  refreshDisplay();
});

for (let i = 1; i <= 6; i++) {
  createPlantOptionButton(i);
}
initializeGrid();
newWeather();
refreshDisplay();
