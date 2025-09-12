import type { LetterDistribution, LanguageDescription } from "./Language";

// German letter distribution based on letter frequency and game balance
// Probabilities are normalized to sum to 1.0
export const GERMAN_LETTER_DISTRIBUTION: LetterDistribution = {
  A: { probability: 0.0558, points: 1, isVowel: true },
  Ä: { probability: 0.0054, points: 6, isVowel: true },
  B: { probability: 0.0196, points: 3, isVowel: false },
  C: { probability: 0.0316, points: 4, isVowel: false },
  D: { probability: 0.0498, points: 1, isVowel: false },
  E: { probability: 0.1693, points: 1, isVowel: true },
  F: { probability: 0.0149, points: 4, isVowel: false },
  G: { probability: 0.0302, points: 2, isVowel: false },
  H: { probability: 0.0498, points: 2, isVowel: false },
  I: { probability: 0.0802, points: 1, isVowel: true },
  J: { probability: 0.0024, points: 6, isVowel: false },
  K: { probability: 0.0132, points: 4, isVowel: false },
  L: { probability: 0.036, points: 2, isVowel: false },
  M: { probability: 0.0255, points: 3, isVowel: false },
  N: { probability: 0.1053, points: 1, isVowel: false },
  O: { probability: 0.0224, points: 2, isVowel: true },
  Ö: { probability: 0.003, points: 8, isVowel: true },
  P: { probability: 0.0067, points: 4, isVowel: false },
  Q: { probability: 0.0002, points: 10, isVowel: false },
  R: { probability: 0.0689, points: 1, isVowel: false },
  ß: { probability: 0.0037, points: 8, isVowel: false },
  S: { probability: 0.0642, points: 1, isVowel: false },
  T: { probability: 0.0579, points: 1, isVowel: false },
  U: { probability: 0.0383, points: 1, isVowel: true },
  Ü: { probability: 0.0065, points: 6, isVowel: true },
  V: { probability: 0.0084, points: 6, isVowel: false },
  W: { probability: 0.0178, points: 3, isVowel: false },
  X: { probability: 0.0005, points: 8, isVowel: false },
  Y: { probability: 0.0005, points: 10, isVowel: false },
  Z: { probability: 0.0121, points: 3, isVowel: false },
} as const;

export const GERMAN_DESCRIPTION: LanguageDescription = {
  code: "de",
  name: "Deutsch",
  flag: "🇩🇪",
} as const;
