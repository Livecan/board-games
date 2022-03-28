const gearDiceOptions = [
  [1, 2],
  [2, 3, 3, 4, 4, 4],
  [4, 5, 6, 6, 7, 7, 8, 8],
  Array.from(new Array(6), (value, index) => index + 7), // 7 ~ 12
  Array.from(new Array(10), (value, index) => index + 11), // 11 ~ 20
  Array.from(new Array(10), (value, index) => index + 21), // 21 ~ 30
];

const rollGearDice = (gear: number) =>
  gearDiceOptions[gear - 1][
    Math.trunc(Math.random() * gearDiceOptions[gear - 1].length)
  ];

const rollBlackDice = () => Math.ceil(Math.random() * 20);

const blackSlowStartMax = 1;
const isSlowStart = (
  blackDiceRoll: number | { (): number } = rollBlackDice
) => {
  return (
    (typeof blackDiceRoll === "number" ? blackDiceRoll : blackDiceRoll()) <=
    blackSlowStartMax
  );
};

const blackFastStartMin = 20;
const isFastStart = (
  blackDiceRoll: number | { (): number } = rollBlackDice
) => {
  return (
    (typeof blackDiceRoll === "number" ? blackDiceRoll : blackDiceRoll()) >=
    blackFastStartMin
  );
};

export { rollGearDice, rollBlackDice, isSlowStart, isFastStart };
