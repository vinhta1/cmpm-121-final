/// <reference lib="deno.ns" />

interface Tile {
  x: number;
  y: number;
  sun: number;
  water: number;
}

interface Scenario {
  sun_levels: number[][]; // stores sun levels
  water_levels: number[][]; // stores water levels
}

// read scenario file
function parseScenarioFile(filePath: string): Scenario {
  const content = Deno.readTextFileSync(filePath); // use Deno readTextFileSync method
  const scenario: Scenario = {
    sun_levels: [],
    water_levels: [],
  };

  const lines = content.split("\n");
  let currentSection = "";

  const sunLevels: number[][] = [];
  const waterLevels: number[][] = [];

  // parse content line by line
  for (let line of lines) {
    line = line.trim();

    // identify sections and parse them
    if (line.startsWith("sun_levels")) {
      currentSection = "sun_levels";
    } else if (line.startsWith("water_levels")) {
      currentSection = "water_levels";
    }

    // parse sun_levels or water_levels section
    if (currentSection === "sun_levels" && line.startsWith("[")) {
      const sunRow = line.slice(1, -1).split(",").map((num) =>
        parseInt(num.trim())
      );
      sunLevels.push(sunRow);
    } else if (currentSection === "water_levels" && line.startsWith("[")) {
      const waterRow = line.slice(1, -1).split(",").map((num) =>
        parseInt(num.trim())
      );
      waterLevels.push(waterRow);
    }
  }

  // assigns parsed sun and water levels to the scenario object
  scenario.sun_levels = sunLevels;
  scenario.water_levels = waterLevels;

  return scenario;
}

// initialize tiles with sun and water levels from scenario
// from sun_levels and water_levels to sun and water
function initializeTiles(scenario: Scenario): Tile[] {
  const tiles: Tile[] = [];

  // iterate over the grid (5 rows, 10 columns)
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 10; x++) {
      const sun = scenario.sun_levels[y][x];
      const water = scenario.water_levels[y][x];
      tiles.push({ x, y, sun, water });
    }
  }

  return tiles;
}

// TESTS
const scenario = parseScenarioFile("scenario_config.txt");
const tiles = initializeTiles(scenario);
console.log(tiles); // This will output the tiles with sun and water levels
