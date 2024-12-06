import YAML from "js-yaml";
import fs from "fs";

// imports plant types and rules
import { PLANT_MAP, PLANT_RULE } from "./plants.ts";

// declares grid and size
const width = 10;
const height = 5;

// imports grid structure
import { Grid } from "./grid.ts";

// scenario setup (YAML format)
const filePath = "./scenario.txt";
const scenarioData = fs.readFileSync(filePath, "utf8");
const scenario = YAML.load(scenarioData);

// tracks harvest count
let harvestCount = 0;

// weather types
type WeatherCondition = "clear" | "dry" | "rainy";
const weatherEffects = scenario.weatherEffects;

// randomly selects weather condition for given day
function getRandomWeather(): WeatherCondition {
  const randomIndex = Math.floor(Math.random() * scenario.weatherConditions.length);
  return scenario.weatherConditions[randomIndex];
}

// applies weather effects to grid
function applyWeather(grid: Grid, weather: WeatherCondition): void {
  const weatherEffect = weatherEffects[weather];

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const cell = grid.getCell(x, y);

      cell.sun += weatherEffect.sunChange;
      cell.water += weatherEffect.waterChange;
    }
  }
}
