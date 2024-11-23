export const IMAGE_PATHS: string[] = [];

function getImageUrl(path: string) {
  return new URL(path, import.meta.url).href;
}

IMAGE_PATHS.push(getImageUrl("./assets/test_pixel.png"));

for (let i = 1; i <= 33; i++) {
  IMAGE_PATHS.push(getImageUrl(`./assets/crops/Crops${i}.png`));
}
