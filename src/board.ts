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
): Orientation => {
  const { x, y } = position;

  // First try horizontal: iterate for TRAY_SIZE fields in horizontal direction
  for (let i = -1; i < TRAY_SIZE; i++) {
    const checkX = x + i;
    if (checkX >= BOARD_WIDTH) break;

    if (board[checkX]?.[y]) {
      return "horizontal";
    }
  }

  // If no letter found horizontally, return vertical
  return "vertical";
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
