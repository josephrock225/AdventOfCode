import { input, print } from "common";

const NUMBERS: { [num: string]: string } = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

function digitList(line: string): number[] {
  const list = [...line];
  return list
    .map((char) => parseInt(char, 10))
    .filter((num) => !isNaN(num));
}

function convertWordsToNums(line: string): string {
  const array = [...line];
  for (let left = 0; left < array.length; left++) {
    for (let right = left; right <= array.length; right++) {
      const slice = array.slice(left, right).join("");
      if (NUMBERS[slice] !== undefined) {
        array.splice(left, 0, NUMBERS[slice]);
        left++;
        break;
      }
    }
  }
  return array.join("");
}

function pt1(raw: string): number {
  const lines = raw.split("\n");
  const calibrationValues = lines
    .map((line) => {
      const digits = digitList(line);
      return digits[0] * 10 + digits[digits.length - 1];
    });
  return calibrationValues.reduce((total, num) => total + num, 0);
}

function pt2(raw: string): number {
  const lines = raw.split("\n");
  const calibrationValues = lines
    .map((line) => {
      const extractNumbers = convertWordsToNums(line);
      const digits = digitList(extractNumbers);
      return digits[0] * 10 + digits[digits.length - 1];
    });
  return calibrationValues.reduce((total, num) => total + num, 0);
}

const raw = input(2023, 1);
print(pt1(raw), pt2(raw));
