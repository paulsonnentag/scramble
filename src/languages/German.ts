import {
  Language,
  type LetterDistribution,
  type LanguageDescription,
} from "./Language";

// German letter distribution based on letter frequency and game balance
// Probabilities are normalized to sum to 1.0
const GERMAN_LETTER_DISTRIBUTION: LetterDistribution = {
  A: { probability: 0.0558, points: 1 },
  Ä: { probability: 0.0054, points: 6 },
  B: { probability: 0.0196, points: 3 },
  C: { probability: 0.0316, points: 4 },
  D: { probability: 0.0498, points: 1 },
  E: { probability: 0.1693, points: 1 },
  F: { probability: 0.0149, points: 4 },
  G: { probability: 0.0302, points: 2 },
  H: { probability: 0.0498, points: 2 },
  I: { probability: 0.0802, points: 1 },
  J: { probability: 0.0024, points: 6 },
  K: { probability: 0.0132, points: 4 },
  L: { probability: 0.036, points: 2 },
  M: { probability: 0.0255, points: 3 },
  N: { probability: 0.1053, points: 1 },
  O: { probability: 0.0224, points: 2 },
  Ö: { probability: 0.003, points: 8 },
  P: { probability: 0.0067, points: 4 },
  Q: { probability: 0.0002, points: 10 },
  R: { probability: 0.0689, points: 1 },
  ß: { probability: 0.0037, points: 8 },
  S: { probability: 0.0642, points: 1 },
  T: { probability: 0.0579, points: 1 },
  U: { probability: 0.0383, points: 1 },
  Ü: { probability: 0.0065, points: 6 },
  V: { probability: 0.0084, points: 6 },
  W: { probability: 0.0178, points: 3 },
  X: { probability: 0.0005, points: 8 },
  Y: { probability: 0.0005, points: 10 },
  Z: { probability: 0.0121, points: 3 },
} as const;

export const GERMAN_DESCRIPTION: LanguageDescription = {
  code: "de",
  name: "Deutsch",
  flag: "🇩🇪",
} as const;

/**
 * German language implementation
 * Letter distribution based on German letter frequency and game balance
 */
export class German extends Language {
  constructor(wordList: string[]) {
    super(wordList);
  }

  getLetterDistribution(): LetterDistribution {
    return GERMAN_LETTER_DISTRIBUTION;
  }
}
