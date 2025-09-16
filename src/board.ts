import type { Word, Letter, Position, Orientation } from "./types";
import { BOARD_HEIGHT, BOARD_WIDTH, TRAY_SIZE } from "./config";
import type { Language } from "./languages/Language";

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

export const isValidOrientation = (
  board: Board,
  position: Position,
  orientation: Orientation
): boolean => {
  const { x, y } = position;

  if (orientation === "horizontal") {
    // Check horizontal direction: iterate for TRAY_SIZE fields in horizontal direction
    for (let i = -1; i < TRAY_SIZE; i++) {
      const checkX = x + i;
      if (board[checkX]?.[y]) {
        return true;
      }
    }
  } else {
    // Check vertical direction: iterate for TRAY_SIZE fields in vertical direction
    for (let i = -1; i < TRAY_SIZE; i++) {
      const checkY = y + i;
      if (board[x]?.[checkY]) {
        return true;
      }
    }
  }

  return false;
};

export const getSuggestedOrientation = (
  board: Board,
  position: Position
): Orientation | null =>
  isValidOrientation(board, position, "vertical")
    ? "vertical"
    : isValidOrientation(board, position, "horizontal")
    ? "horizontal"
    : null;

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

export const getNewWordsCreated = (
  board: Board,
  placedWord: Word
): string[] => {
  const newWords: string[] = [];
  const { start, orientation, letters } = placedWord;

  // Create a temporary board with the new word placed
  const tempBoard = structuredClone(board);

  // Place the new word on the temporary board
  letters.forEach((letter, index) => {
    if (letter !== null) {
      const x = orientation === "horizontal" ? start.x + index : start.x;
      const y = orientation === "vertical" ? start.y + index : start.y;

      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
        if (!tempBoard[x]) tempBoard[x] = {};
        tempBoard[x][y] = letter;
      }
    }
  });

  // 1. Check the main word (the word being placed, including gaps filled by existing letters)
  const mainWord = getWordAtPosition(tempBoard, start, orientation);
  if (mainWord && mainWord.length > 1) {
    newWords.push(mainWord);
  }

  // 2. Check for perpendicular words created by each placed letter
  letters.forEach((letter, index) => {
    if (letter !== null) {
      const x = orientation === "horizontal" ? start.x + index : start.x;
      const y = orientation === "vertical" ? start.y + index : start.y;

      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
        // Check perpendicular direction
        const perpendicularOrientation =
          orientation === "horizontal" ? "vertical" : "horizontal";
        const perpendicularWord = getWordAtPosition(
          tempBoard,
          { x, y },
          perpendicularOrientation
        );

        if (perpendicularWord && perpendicularWord.length > 1) {
          // Only add if this creates a new word (not just a single letter)
          const existingWord = getWordAtPosition(
            board,
            { x, y },
            perpendicularOrientation
          );
          if (!existingWord || existingWord !== perpendicularWord) {
            newWords.push(perpendicularWord);
          }
        }
      }
    }
  });

  // Remove duplicates and return
  return [...new Set(newWords)];
};

const getWordAtPosition = (
  board: Board,
  position: Position,
  orientation: Orientation
): string | null => {
  const { x, y } = position;
  let word = "";

  if (orientation === "horizontal") {
    // Find the start of the word by going left
    let startX = x;
    while (startX > 0 && board[startX - 1]?.[y]) {
      startX--;
    }

    // Build the word by going right
    let currentX = startX;
    while (currentX < BOARD_WIDTH && board[currentX]?.[y]) {
      word += board[currentX][y]!.value;
      currentX++;
    }
  } else {
    // Find the start of the word by going up
    let startY = y;
    while (startY > 0 && board[x]?.[startY - 1]) {
      startY--;
    }

    // Build the word by going down
    let currentY = startY;
    while (currentY < BOARD_HEIGHT && board[x]?.[currentY]) {
      word += board[x][currentY]!.value;
      currentY++;
    }
  }

  return word.length > 0 ? word : null;
};

export const validateWordPlacement = (
  board: Board,
  placedWord: Word,
  language: Language
): { isValid: boolean; invalidWords: string[] } => {
  const newWords = getNewWordsCreated(board, placedWord);
  const invalidWords: string[] = [];

  // Validate each new word
  newWords.forEach((word) => {
    if (!language.isValidWord(word)) {
      invalidWords.push(word);
    }
  });

  return {
    isValid: invalidWords.length === 0,
    invalidWords,
  };
};

export const calculateWordScore = (
  board: Board,
  placedWord: Word,
  language: Language
): number => {
  const newWords = getNewWordsCreated(board, placedWord);
  let totalScore = 0;

  // Score all new words created
  newWords.forEach((word) => {
    let wordScore = 0;

    // Sum up letter points for each letter in the word
    for (const char of word) {
      wordScore += language.getLetterPoints(char);
    }

    totalScore += wordScore;
  });

  return totalScore;
};
