import YAML from "js-yaml";
import {yamlstring} from "./scenario-yaml.ts"

const scenario = YAML.load(yamlstring);

export function debugprint() {
  console.log(YAML.load(yamlstring));
}

export function getWeather() {
  const weathercon = scenario.weatherEffects;
  return weathercon.sunny
}