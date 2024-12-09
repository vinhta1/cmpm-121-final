// @deno-types="npm:@types/js-yaml@^4.0.9"
import YAML from "js-yaml";
import { yamlstring } from "./scenario-yaml.ts";

// deno-lint-ignore no-explicit-any
const scenario: any = YAML.load(yamlstring);

export function debugprint() {
  console.log(YAML.load(yamlstring));
}

export function getWeather(getWeather: string) {
  const weathercon = scenario.weatherEffects;
  return weathercon[getWeather];
}

export function weatherCheck(day: number) {
  const weather = scenario.weatherCycle[day.toString()] || "none";
  if (weather == "none") {
    return "none";
  } else {
    console.log("custom weather!!!");
    return weather;
  }
}

export function getWinCon() {
  return parseInt(scenario.winCondition["totalHarvests"]);
}
