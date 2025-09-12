import {
  Language,
  type LetterDistribution,
  type LanguageDescription,
} from "./Language";

// English letter distribution based on letter frequency and game balance
// Probabilities are normalized to sum to 1.0
const ENGLISH_LETTER_DISTRIBUTION: LetterDistribution = {
  A: { probability: 0.0834, points: 1 },
  B: { probability: 0.0154, points: 3 },
  C: { probability: 0.0273, points: 3 },
  D: { probability: 0.0414, points: 2 },
  E: { probability: 0.126, points: 1 },
  F: { probability: 0.0203, points: 4 },
  G: { probability: 0.0192, points: 2 },
  H: { probability: 0.0611, points: 4 },
  I: { probability: 0.0671, points: 1 },
  J: { probability: 0.0023, points: 8 },
  K: { probability: 0.0087, points: 5 },
  L: { probability: 0.0424, points: 1 },
  M: { probability: 0.0253, points: 3 },
  N: { probability: 0.068, points: 1 },
  O: { probability: 0.077, points: 1 },
  P: { probability: 0.0166, points: 3 },
  Q: { probability: 0.0009, points: 10 },
  R: { probability: 0.0568, points: 1 },
  S: { probability: 0.0611, points: 1 },
  T: { probability: 0.0937, points: 1 },
  U: { probability: 0.0285, points: 1 },
  V: { probability: 0.0106, points: 4 },
  W: { probability: 0.0234, points: 4 },
  X: { probability: 0.002, points: 8 },
  Y: { probability: 0.0204, points: 4 },
  Z: { probability: 0.0006, points: 10 },
} as const;

export const ENGLISH_DESCRIPTION: LanguageDescription = {
  code: "en",
  name: "English",
  flag: "🇬🇧",
} as const;

/**
 * English language implementation
 * Letter distribution based on English letter frequency and game balance
 */
export class English extends Language {
  constructor(wordList: string[]) {
    super(wordList);
  }

  getLetterDistribution(): LetterDistribution {
    return ENGLISH_LETTER_DISTRIBUTION;
  }
}
