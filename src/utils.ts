const createArrayWithOneValue = (value: any, length: number): any[] => {
  const arr = [];
  for (let i: number = 0; i < length; i++) arr.push(value);
  return arr;
};

const shuffleArray = (arr: any[]): any[] => {
  for (let i: number = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const sortArrayOfObjectsByProperty = (
  arr: any[],
  property: string,
  descending: boolean
): any[] => {
  return descending
    ? arr.sort((a, b) => (a[property].value > b[property].value ? -1 : 1))
    : arr.sort((a, b) => (a[property].value > b[property].value ? 1 : -1));
};

export { createArrayWithOneValue, shuffleArray, sortArrayOfObjectsByProperty };