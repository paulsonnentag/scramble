import { Language } from "./languages/Language";

export const toJS = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const getLetterPoints = (
  letter: string,
  language?: Language
): number => {
  if (!language) {
    // Fallback: basic point values for common letters
    const basicPoints: { [letter: string]: number } = {
      A: 1,
      B: 3,
      C: 3,
      D: 2,
      E: 1,
      F: 4,
      G: 2,
      H: 4,
      I: 1,
      J: 8,
      K: 5,
      L: 1,
      M: 3,
      N: 1,
      O: 1,
      P: 3,
      Q: 10,
      R: 1,
      S: 1,
      T: 1,
      U: 1,
      V: 4,
      W: 4,
      X: 8,
      Y: 4,
      Z: 10,
      Ä: 6,
      Ö: 8,
      Ü: 6,
      ß: 8, // German letters
    };
    return basicPoints[letter.toUpperCase()] || 0;
  }

  return language.getLetterPoints(letter);
};
