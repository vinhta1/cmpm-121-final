export const yamlstring = `
weatherEffects:
  sunny:
    sunChange: 5
    waterChange: -1
  rainy:
    sunChange: 1
    waterChange: 7
  clear:
    sunChange: 3
    waterChange: 3

weatherCycle:
  5: sunny
  7: rainy
  10: sunny
  12: clear
  14: rainy
  15: sunny
  20: sunny
  21: rainy
  24: clear
  25: sunny
  28: rainy
  30: sunny
  35: rainy
  36: clear
  40: sunny
  42: rainy
  45: sunny
  48: clear
  49: rainy

winCondition:
  totalHarvests: 12
  description: "Harvest 12 plants in total to win the game."
`;
