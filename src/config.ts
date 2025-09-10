// Game Configuration
// Centralized configuration for all game settings

// === BOARD CONFIGURATION ===
export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 12;

// === LETTER TRAY CONFIGURATION ===
export const TRAY_SIZE = 7;
export const TARGET_VOWEL_RATIO = 0.4; // 40% vowels target

// === LETTER DISTRIBUTION ===
// English letter distribution based on Scrabble
export const LETTER_DISTRIBUTION = {
  A: { count: 9, points: 1 },
  B: { count: 2, points: 3 },
  C: { count: 2, points: 3 },
  D: { count: 4, points: 2 },
  E: { count: 12, points: 1 },
  F: { count: 2, points: 4 },
  G: { count: 3, points: 2 },
  H: { count: 2, points: 4 },
  I: { count: 9, points: 1 },
  J: { count: 1, points: 8 },
  K: { count: 1, points: 5 },
  L: { count: 4, points: 1 },
  M: { count: 2, points: 3 },
  N: { count: 6, points: 1 },
  O: { count: 8, points: 1 },
  P: { count: 2, points: 3 },
  Q: { count: 1, points: 10 },
  R: { count: 6, points: 1 },
  S: { count: 4, points: 1 },
  T: { count: 6, points: 1 },
  U: { count: 4, points: 1 },
  V: { count: 2, points: 4 },
  W: { count: 2, points: 4 },
  X: { count: 1, points: 8 },
  Y: { count: 2, points: 4 },
  Z: { count: 1, points: 10 },
} as const;

// === LETTER CLASSIFICATION ===
export const VOWELS = ["A", "E", "I", "O", "U"] as const;
export const CONSONANTS = Object.keys(LETTER_DISTRIBUTION).filter((letter) => !VOWELS.includes(letter as any));

// === NETWORK CONFIGURATION ===
export const WEBSOCKET_URL = "wss://sync3.automerge.org";

// === KEYBOARD CONFIGURATION ===
export const KEY_ACCEPT = "Enter";
export const KEY_REJECT = "Escape";
export const KEY_BACKSPACE = "Backspace";

// Type helpers for configuration
export type LetterKey = keyof typeof LETTER_DISTRIBUTION;
export type VowelKey = (typeof VOWELS)[number];
export type ConsonantKey = (typeof CONSONANTS)[number];
