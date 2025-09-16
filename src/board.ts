import type { Word, Letter, Position, Orientation } from "./types";
import { BOARD_HEIGHT, BOARD_WIDTH, TRAY_SIZE } from "./config";

export type Board = { [x: number]: { [y: number]: Letter | null } };

export const computeBoardFromWords = (words: Word[]): Board => {
  // Create empty board
  const board: Board = {};
  for (let x = 0; x < BOARD_WIDTH; x++) {
    board[x] = {};
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      board[x][y] = null;
    }
  }

  // Place all words
  words.forEach((word) => {
    const { start, orientation, letters } = word;
    letters.forEach((letter, index) => {
      if (letter !== null) {
        const x = orientation === "horizontal" ? start.x + index : start.x;
        const y = orientation === "vertical" ? start.y + index : start.y;

        if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
          board[x][y] = letter;
        }
      }
    });
  });

  return board;
};

export const getSuggestedOrientation = (
  board: Board,
  position: Position
): Orientation | null => {
  const { x, y } = position;

  // Check horizontal direction: iterate for TRAY_SIZE fields in horizontal direction
  for (let i = -1; i < TRAY_SIZE; i++) {
    const checkX = x + i;
    if (board[checkX]?.[y]) {
      return "horizontal";
    }
  }

  // Check vertical direction: iterate for TRAY_SIZE fields in vertical direction
  for (let i = -1; i < TRAY_SIZE; i++) {
    const checkY = y + i;

    if (board[x]?.[checkY]) {
      return "vertical";
    }
  }

  // If no overlap or overlap in both directions, return null
  return null;
};

export const getNextAvailablePosition = (
  word: Word,
  board: Board
): Position | null => {
  const { start, orientation, letters } = word;

  for (let i = 0; i < TRAY_SIZE; i++) {
    const x = orientation === "horizontal" ? start.x + i : start.x;
    const y = orientation === "vertical" ? start.y + i : start.y;

    // Check bounds
    if (x >= BOARD_WIDTH || y >= BOARD_HEIGHT || x < 0 || y < 0) {
      return null;
    }

    // Skip if there's already a letter at this position in the word
    if (i < letters.length && letters[i] !== null) {
      continue;
    }

    // Skip if there's a letter on the board at this position
    if (board[x]?.[y]) {
      continue;
    }

    // Found an empty position
    return { x, y };
  }

  return null;
};

export const findEmptyTraySlot = (tray: (Letter | null)[]): number => {
  for (let i = 0; i < tray.length; i++) {
    if (tray[i] === null) {
      return i;
    }
  }
  return -1;
};

export const moveWordLettersToTray = (
  word: Word,
  tray: (Letter | null)[]
): void => {
  // Move all letters from word back to tray
  word.letters.forEach((letter) => {
    if (letter) {
      const emptySlot = findEmptyTraySlot(tray);
      if (emptySlot !== -1) {
        tray[emptySlot] = letter;
      }
    }
  });
};
