import * as r from "./renderer.ts";
import * as c from "./config.ts";
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

canvasElement.style.width = `${width * c.TILE_SIZE}px`;
canvasElement.style.height = `${height * c.TILE_SIZE}px`;

const renderer = new r.P5Renderer(c.IMAGE_PATHS, scale);

const grid = new g.Grid(width, height);

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    grid.setCell({
      x: j,
      y: i,
      plantID: Math.random() * 10,
      growthLevel: Math.random() * 10,
      sun: Math.random() * 10,
      water: Math.random() * 10,
      backgroundID: Math.random() * 10,
    });
  }
}

for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    console.log(grid.getCell(j, i));
  }
}

setInterval(() => {
  console.log("drawing");
  renderer.clear();
  renderer.addImage(
    c.IMAGE_PATHS[2],
    0 + c.TILE_SIZE / 2,
    0 + c.TILE_SIZE / 2,
    c.TILE_SIZE,
  );
}, 1000);
