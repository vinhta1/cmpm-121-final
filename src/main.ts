const app = document.querySelector<HTMLDivElement>("#app")!;

const test : HTMLHeadingElement = document.createElement("h1");
test.innerHTML = "TEST"
app.appendChild(test);