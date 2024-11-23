// @ts-ignore: <Vite uses import on static assets to get the resolved public URL, I'm too tired to figure out how to make deno happy about that>

import test from "./assets/test_pixel.png";

export const IMAGE_PATHS: string[] = [
  `${test}`,
];
