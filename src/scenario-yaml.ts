export const yamlstring = `plantTypes:
  - turnip
  - radish
  - carrot
  - potato
  - onion
  - spinach
  
weatherConditions:
  - sunny
  - rainy
  - clear

weatherEffects:
  sunny:
    sunChange: 3
    waterChange: -1
  rainy:
    sunChange: -1
    waterChange: 3
  clear:
    sunChange: 0
    waterChange: 0

weatherCycle:
  Day 1: clear
  Day 2: sunny
  Day 3: rainy

winCondition:
  totalHarvests: 12
  description: "Harvest 12 plants in total to win the game."
`