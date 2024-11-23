// @deno-types="npm:@types/p5@^1.7.6"
import p5 from "p5";

interface ImageCommand {
  img: string;
  x: number;
  y: number;
  scale: number;
}

interface Renderer {
  ready: Promise<void>;
  addImage(path: string, x: number, y: number, scale: number): void;
  clear(): void;
}

export class P5Renderer implements Renderer {
  private p: p5;
  private images: ImageCommand[];
  private imagePaths: string[];
  private preloadedImages: Map<string, p5.Image>;

  public ready: Promise<void>;
  private resolveReady: () => void = () => {};

  constructor(imagePaths: string[]) {
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve;
    });

    this.images = [];
    this.imagePaths = imagePaths;
    this.preloadedImages = new Map<string, p5.Image>();
    this.p = new p5(this.sketch.bind(this));
  }

  private sketch(p: p5) {
    p.preload = () => {
      this.preloadImages();
    };
    p.setup = () => {
      const canvasElement: HTMLDivElement = document.querySelector(
        "#canvas-container",
      )!;
      const size: DOMRect = canvasElement.getBoundingClientRect();
      const canvas = p.createCanvas(size.width, size.height);
      canvas.parent(canvasElement);
      p.background(255);
      this.resolveReady();
    };
    p.draw = () => {
      if (this.images.length > 0) {
        this.renderImages();
      }
    };
  }

  private preloadImages() {
    this.imagePaths.forEach((path) => {
      const imageP5 = this.p.loadImage(`${import.meta.env.BASE_URL}/${path}`);
      this.preloadedImages.set(path, imageP5);
    });
  }

  private renderImages() {
    this.images.forEach((i: ImageCommand) => {
      this.p.push();
      this.p.imageMode;
      this.p.imageMode(this.p.CENTER);
      this.p.translate(i.x, i.y);
      this.p.scale(i.scale);
      this.p.image(this.preloadedImages.get(i.img)!, 0, 0);
      this.p.pop();
    });
  }

  public addImage(path: string, x: number, y: number, scale: number) {
    if (this.preloadedImages.get(path)) {
      this.images.push({ img: path, x, y, scale });
    } else {
      console.warn("Please define image in config.ts IMAGE_PATHS");
    }
  }

  public clear() {
    this.p.clear();
    this.p.background(255);
    this.images.length = 0;
  }
}
