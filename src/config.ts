export const IMAGE_PATHS: string[] = [];
export const TILE_SIZE: number = 16;

IMAGE_PATHS.push(new URL("./assets/test_pixel.png", import.meta.url).href);

function getCropUrl(name: string) {
  return new URL(`./assets/crops/${name}.png`, import.meta.url).href;
}

for (let i = 1; i <= 33; i++) {
  IMAGE_PATHS.push(getCropUrl(`Crops${i}`));
}
