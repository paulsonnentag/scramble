import type { LetterDistribution, LanguageDescription } from "./Language";

// English letter distribution based on letter frequency and game balance
// Probabilities are normalized to sum to 1.0
export const ENGLISH_LETTER_DISTRIBUTION: LetterDistribution = {
  A: { probability: 0.0834, points: 1, isVowel: true },
  B: { probability: 0.0154, points: 3, isVowel: false },
  C: { probability: 0.0273, points: 3, isVowel: false },
  D: { probability: 0.0414, points: 2, isVowel: false },
  E: { probability: 0.126, points: 1, isVowel: true },
  F: { probability: 0.0203, points: 4, isVowel: false },
  G: { probability: 0.0192, points: 2, isVowel: false },
  H: { probability: 0.0611, points: 4, isVowel: false },
  I: { probability: 0.0671, points: 1, isVowel: true },
  J: { probability: 0.0023, points: 8, isVowel: false },
  K: { probability: 0.0087, points: 5, isVowel: false },
  L: { probability: 0.0424, points: 1, isVowel: false },
  M: { probability: 0.0253, points: 3, isVowel: false },
  N: { probability: 0.068, points: 1, isVowel: false },
  O: { probability: 0.077, points: 1, isVowel: true },
  P: { probability: 0.0166, points: 3, isVowel: false },
  Q: { probability: 0.0009, points: 10, isVowel: false },
  R: { probability: 0.0568, points: 1, isVowel: false },
  S: { probability: 0.0611, points: 1, isVowel: false },
  T: { probability: 0.0937, points: 1, isVowel: false },
  U: { probability: 0.0285, points: 1, isVowel: true },
  V: { probability: 0.0106, points: 4, isVowel: false },
  W: { probability: 0.0234, points: 4, isVowel: false },
  X: { probability: 0.002, points: 8, isVowel: false },
  Y: { probability: 0.0204, points: 4, isVowel: false },
  Z: { probability: 0.0006, points: 10, isVowel: false },
} as const;

export const ENGLISH_DESCRIPTION: LanguageDescription = {
  code: "en",
  name: "English",
  flag: "🇬🇧",
} as const;
