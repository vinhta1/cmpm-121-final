import * as r from "./renderer";
import * as c from "./config";

const app = document.querySelector<HTMLDivElement>("#app")!;

const test: HTMLHeadingElement = document.createElement("h1");
test.innerHTML = "TEST"
app.appendChild(test);

const renderer = new r.P5Renderer(c.IMAGE_PATHS);
await renderer.ready;

setInterval(() => {
    console.log("drawing")
    renderer.refresh();
    renderer.addImage(c.IMAGE_PATHS[0], Math.random() * 300, Math.random() * 200, 20);
}, 1000)


