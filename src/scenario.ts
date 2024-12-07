import YAML from "js-yaml";
import fs from "fs";

// imports main functions for weather and win conditions
import { checkWinCondition, newWeather } from "./main.ts";

// scenario setup (YAML format)
const filePath = "./scenario.txt";
const scenarioData = fs.readFileSync(filePath, "utf8");
const scenario = YAML.load(scenarioData);

// simulates in-game day
function simulateDay(day: number) {
  console.log(`Day ${day}: Simulation begins.`);

  // Apply weather changes using the shared newWeather function
  newWeather();

  // checks win condition using shared checkWinCondition function
  const totalHarvested = checkWinCondition();

  if (totalHarvested) {
    console.log("You win!");
    return;
  }
  console.log(`Day ${day}: Simulation ends.`);
}

export { scenario, simulateDay };
