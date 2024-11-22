import * as r from "./renderer";
import * as c from "./config";

const app = document.querySelector<HTMLDivElement>("#app")!;

const test: HTMLHeadingElement = document.createElement("h1");
test.innerHTML = "TEST"
app.appendChild(test);

const renderer = new r.P5Renderer(c.IMAGE_PATHS);
await new Promise(r => setTimeout(r, 100)); // temp solution, p5 sets up asynchronously causing problems if functions called right after

for(let i = 0; i<20;i++){
    renderer.addImage(c.IMAGE_PATHS[0],Math.random()*100,Math.random()*100,20);
}

