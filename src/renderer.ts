// @deno-types="npm:@types/p5@^1.7.6"
import p5 from "p5";

interface ImageCommand {
  img: string;
  x: number;
  y: number;
  scale: number;
}

export interface Renderer {
  addImage(path: string, x: number, y: number, scale: number): void;
  clear(): void;
}
export class JSRenderer implements Renderer {
  private scale: number;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private loadedImages!: Map<string, HTMLImageElement>;

  private readyPromise: Promise<void>;
  private resolveReadyPromise: () => void = () => {};

  constructor(imagePaths: string[], scale: number) {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReadyPromise = resolve;
    });
    this.loadImages(imagePaths);
    this.scale = scale;
    this.init();
  }

  private init() {
    const canvasElement: HTMLDivElement = document.querySelector(
      "#canvas-container",
    )!;
    const size: DOMRect = canvasElement.getBoundingClientRect();
    this.canvas = document.createElement("canvas");
    this.canvas.width = size.width / this.scale;
    this.canvas.height = size.height / this.scale;
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.transform = `scale(${this.scale})`;
    this.canvas.style.transformOrigin = "0 0";
    canvasElement.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
    this.clear();
  }

  private loadImages(imagePaths: string[]): void {
    this.loadedImages = new Map<string, HTMLImageElement>();
    const imageLoadPromises = imagePaths.map((path) => {
      return new Promise<void>((resolve) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
          this.loadedImages.set(path, image);
          resolve();
        };
      });
    });

    Promise.all(imageLoadPromises).then(() => {
      this.resolveReadyPromise();
    });
  }

  public async addImage(path: string, x: number, y: number, scale: number) {
    await this.readyPromise;
    if (this.loadedImages.get(path)) {
      this.ctx.drawImage(
        this.loadedImages.get(path)!,
        x - scale / 2,
        y - scale / 2,
        scale,
        scale,
      );
    } else {
      console.warn("Please define image in config.ts IMAGE_PATHS: " + path);
    }
  }
  public clear() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export class P5Renderer implements Renderer {
  private p: p5;
  private images: ImageCommand[];
  private imagePaths: string[];
  private preloadedImages: Map<string, p5.Image>;

  private scale: number;

  private readyPromise: Promise<void>;
  private resolveReadyPromise: () => void = () => {};

  constructor(imagePaths: string[], scale: number) {
    this.readyPromise = new Promise((resolve) => {
      this.resolveReadyPromise = resolve;
    });
    this.images = [];
    this.imagePaths = imagePaths;
    this.preloadedImages = new Map<string, p5.Image>();
    this.scale = scale;
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
      const canvas = p.createCanvas(
        size.width / this.scale,
        size.height / this.scale,
      );
      canvas.parent(canvasElement);

      const htmlCanvas = document.querySelector("canvas")!;
      htmlCanvas.style.imageRendering = "pixelated";
      htmlCanvas.style.transform = `scale(${this.scale})`;
      htmlCanvas.style.transformOrigin = "0 0";

      p.noSmooth();
      p.background(255);
      p.noLoop();
      this.resolveReadyPromise();
    };
    p.draw = () => {
      if (this.images.length > 0) {
        this.renderImages();
      }
    };
  }

  private preloadImages() {
    this.imagePaths.forEach((path) => {
      const imageP5 = this.p.loadImage(path);
      this.preloadedImages.set(path, imageP5);
    });
  }

  private renderImages() {
    this.images.forEach((i: ImageCommand) => {
      this.p.push();
      this.p.imageMode;
      this.p.imageMode(this.p.CENTER);
      this.p.translate(i.x, i.y);
      this.p.image(this.preloadedImages.get(i.img)!, 0, 0, i.scale, i.scale);
      this.p.pop();
    });
  }

  public async addImage(path: string, x: number, y: number, scale: number) {
    await this.readyPromise;
    if (this.preloadedImages.get(path)) {
      this.images.push({ img: path, x, y, scale });
      this.p.draw();
    } else {
      console.warn("Please define image in config.ts IMAGE_PATHS: " + path);
    }
  }

  public async clear() {
    await this.readyPromise;
    this.p.clear();
    this.p.background(255);
    this.images.length = 0;
  }
}
