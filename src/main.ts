import p5 from 'p5';
const app = document.querySelector<HTMLDivElement>("#app")!;

const test: HTMLHeadingElement = document.createElement("h1");
test.innerHTML = "TEST"
app.appendChild(test);



const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(400, 400);
    };

    p.draw = () => {
        p.background(220);
        p.fill(255, 0, 0);
        p.ellipse(200, 200, 100, 100);
    };
};

new p5(sketch);