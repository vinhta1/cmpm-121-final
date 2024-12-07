import fs from "Node:fs";
import YAML from "js-yaml";

// Define the weather effect structure
interface WeatherEffect {
  sunChange: number;
  waterChange: number;
}

// Define the tile properties
interface Tile {
  sun: number;
  water: number;
}

// Define the output structure for each day's scenario
interface DailyScenario {
  day: string;
  weather: string;
  weatherEffect: WeatherEffect;
  tiles: Tile[];
}

// Load the scenario data from a YAML file
function loadScenario(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return YAML.load(fileContent);
}

// Function to apply weather effects to the tiles
function applyWeatherEffect(tiles: Tile[], effect: WeatherEffect): Tile[] {
  return tiles.map((tile) => ({
    sun: tile.sun + effect.sunChange,
    water: tile.water + effect.waterChange,
  }));
}

// Function to generate the scenario with weather and tiles for each day
function generateScenario() {
  // Load the weather data from the scenario.txt (YAML format)
  const scenarioData = loadScenario("scenario.txt");
  const weatherEffects = scenarioData.weatherEffects;
  const weatherCycle = scenarioData.weatherCycle;

  // Example tiles, starting state for Day 0
  let tiles: Tile[] = [
    { sun: 2, water: 4 }, // Tile 1: Sun=2, Water=4
    { sun: 2, water: 4 }, // Tile 2: Sun=2, Water=4
    { sun: 2, water: 4 }, // Tile 3: Sun=2, Water=4
  ];

  console.log("Initial Tiles (Day 0):", tiles);

  // Store the output scenario for each day
  const scenarioOutput: { [key: string]: DailyScenario } = {};

  // Iterate over the weather cycle (each day) and apply the weather effect
  let dayIndex = 1;
  for (const [day, weatherCondition] of Object.entries(weatherCycle)) {
    // Ensure that the weatherCondition is treated as a string
    const weatherConditionTyped = weatherCondition as string;

    console.log(`\nDay ${dayIndex}: ${day}, Weather: ${weatherConditionTyped}`);

    // Get the weather effect for the current day
    const weatherEffect: WeatherEffect = weatherEffects[weatherConditionTyped];

    // Apply the weather effect to each tile based on the previous day's state
    tiles = applyWeatherEffect(tiles, weatherEffect);

    console.log(`Updated Tiles for Day ${dayIndex}:`, tiles);

    // Save the updated tiles for this day
    scenarioOutput[day] = {
      day: day,
      weather: weatherConditionTyped,
      weatherEffect: weatherEffect,
      tiles: tiles,
    };

    dayIndex++; // Increment day index for each cycle
  }

  // Convert the scenario output to YAML
  const yamlOutput = YAML.dump(scenarioOutput);

  // Write the YAML output to a file
  fs.writeFileSync("scenario_output.yaml", yamlOutput);

  console.log("Scenario saved as YAML!");
}

// Run the function to generate the scenario
generateScenario();
