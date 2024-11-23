import * as r from "./renderer.ts";
import * as c from "./config.ts";
import * as g from "./grid.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

const test: HTMLHeadingElement = document.createElement("h1");
test.innerHTML = "TEST";
app.appendChild(test);

const renderer = new r.P5Renderer(c.IMAGE_PATHS);

const width = 3;
const height = 3;
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

drawing();

async function drawing() {
  await renderer.ready;

  setInterval(() => {
    console.log("drawing");
    renderer.clear();
    renderer.addImage(
      c.IMAGE_PATHS[2],
      Math.random() * 300,
      Math.random() * 200,
      1,
    );
  }, 1000);
}
