export const IMAGE_PATHS: string[] = [];
export const TILE_SIZE: number = 16;

export const KEY_MAP: Record<string, string> = {
  w: "up",
  ArrowUp: "up",
  a: "left",
  ArrowLeft: "left",
  s: "down",
  ArrowDown: "down",
  d: "right",
  ArrowRight: "right",
};

export const PLANT_MAP: Record<number, { name: string; imageID: number }> = {
  1: { name: "turnip", imageID: 5 },
  2: { name: "radish", imageID: 10 },
  3: { name: "carrot", imageID: 15 },
  4: { name: "potato", imageID: 20 },
  5: { name: "onion", imageID: 25 },
  6: { name: "spinach", imageID: 30 },
};

export function clamp(n: number, max: number, min: number) {
  return Math.max(min, Math.min(n, max));
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

IMAGE_PATHS.push(new URL("./assets/test_pixel.png", import.meta.url).href);

function getCropUrl(name: string) {
  return new URL(`./assets/crops/${name}.png`, import.meta.url).href;
}

for (let i = 1; i <= 33; i++) {
  IMAGE_PATHS.push(getCropUrl(`Crops${i}`));
}

IMAGE_PATHS.push(new URL("./assets/outline.png", import.meta.url).href);
IMAGE_PATHS.push(new URL("./assets/outline2.png", import.meta.url).href);
