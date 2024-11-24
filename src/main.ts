import * as r from "./renderer.ts";
import * as u from "./utility.ts";
import * as g from "./grid.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

const title: HTMLHeadingElement = document.createElement("h1");
title.innerHTML = "TEST";
app.appendChild(title);

const canvasElement: HTMLDivElement = document.querySelector(
  "#canvas-container",
)!;
app.appendChild(canvasElement);

const tileInformation: HTMLDivElement = document.createElement("div");
app.appendChild(tileInformation);

const width = 10;
const height = 5;

const scale = 5;

canvasElement.style.width = `${width * u.TILE_SIZE * scale}px`;
canvasElement.style.height = `${height * u.TILE_SIZE * scale}px`;

const renderer = new r.P5Renderer(u.IMAGE_PATHS, scale);

const grid = new g.Grid(width, height);

let playerX = 0;
let playerY = 0;

const playerReach = 1;

let outlineX = -1;
let outlineY = -1;

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

function tileOffset(n: number) {
  return n * u.TILE_SIZE + u.TILE_SIZE / 2;
}

function createBackground() {
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

function drawOutline() {
  renderer.addImage(
    u.IMAGE_PATHS[34],
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
  if (outlineX != -1 && outlineY != -1) {
    const tile: g.GridCell = grid.getCell(outlineX, outlineY);
    tileInformation.innerHTML =
      `Tile : (${tile.x},${tile.y}) Sun : ${tile.sun} Water : ${tile.water}`;
  } else {
    tileInformation.innerHTML = "No Tile Selected";
  }
}

function refreshDisplay() {
  renderer.clear();
  createBackground();
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

  if (
    u.distance(outlineX, outlineY, playerX, playerY) >
      Math.sqrt(2) * playerReach
  ) {
    outlineX = -1;
    outlineY = -1;
  }

  refreshDisplay();
});

document.addEventListener("mousemove", (e) => {
  const rect = canvasElement.getBoundingClientRect();
  let x = Math.floor((e.clientX - rect.left) / (u.TILE_SIZE * scale));
  let y = Math.floor((e.clientY - rect.top) / (u.TILE_SIZE * scale));

  if (
    u.distance(x, y, playerX, playerY) >
      Math.sqrt(2) * playerReach
  ) {
    x = -1;
    y = -1;
  }

  if (outlineX != x || outlineY != y) {
    outlineX = x;
    outlineY = y;
    refreshDisplay();
  }
});

initializeGrid();
refreshDisplay();
