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

const width = 10;
const height = 5;

const scale = 5;

canvasElement.style.width = `${width * u.TILE_SIZE}px`;
canvasElement.style.height = `${height * u.TILE_SIZE}px`;

const renderer = new r.P5Renderer(u.IMAGE_PATHS, scale);

const grid = new g.Grid(width, height);

let playerX = 0;
let playerY = 0;

const playerSpeed = 5;

const playerReach = 1;

let outlineX = 0;
let outlineY = 0;

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
    Math.floor(tileOffset(playerX)),
    Math.floor(tileOffset(playerY)),
    8,
  );
}

function refreshDisplay() {
  renderer.clear();
  createBackground();
  drawOutline();
  drawPlayer();
}

const keysPressed: Record<string, boolean> = {};

let lastTime = 0;
function gameLoop(time: number) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;
  if (keysPressed["up"]) {
    playerY -= playerSpeed * deltaTime;
  }
  if (keysPressed["down"]) {
    playerY += playerSpeed * deltaTime;
  }
  if (keysPressed["left"]) {
    playerX -= playerSpeed * deltaTime;
  }
  if (keysPressed["right"]) {
    playerX += playerSpeed * deltaTime;
  }
  refreshDisplay();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  keysPressed[u.KEY_MAP[event.key.toLocaleLowerCase()]] = true;
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
  keysPressed[u.KEY_MAP[event.key.toLocaleLowerCase()]] = false;
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
  }
});

initializeGrid();
requestAnimationFrame(gameLoop);
