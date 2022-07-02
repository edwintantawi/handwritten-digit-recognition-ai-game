const MAX = 9;

function generateNumber() {
  return Math.floor(Math.random() * 10); // gen random number between 0-9
}

function questsOfSum(length: number): number[][] {
  const result = [];

  while (result.length < length) {
    const x = generateNumber();
    const y = generateNumber();

    const sum = x + y;
    if (sum <= MAX) result.push([x, y, sum]);
  }

  return result;
}

export { questsOfSum };
