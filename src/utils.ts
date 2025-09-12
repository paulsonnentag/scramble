import { LETTER_DISTRIBUTION } from "./config";

export const toJS = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const getLetterPoints = (letter: string): number => {
  const letterData =
    LETTER_DISTRIBUTION[
      letter.toUpperCase() as keyof typeof LETTER_DISTRIBUTION
    ];
  return letterData ? letterData.points : 0;
};
