import type { Letter, GameState, Board } from "./types";
import {
  TRAY_SIZE,
  TARGET_VOWEL_RATIO,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "./config";
import { Language } from "./languages/Language";

export function fillTray(
  currentTray: (Letter | null)[],
  language: Language
): void {
  // Balance vowels and consonants using the language's distribution
  let vowelsInTray = 0;
  let totalInTray = 0;

  // Count existing letters
  for (const letter of currentTray) {
    if (letter !== null) {
      totalInTray++;
      if (language.isVowel(letter.value)) {
        vowelsInTray++;
      }
    }
  }

  const targetVowelRatio = TARGET_VOWEL_RATIO; // Aim for configured vowel ratio

  for (let i = 0; i < currentTray.length; i++) {
    // If there's already a letter at this position, skip it
    if (currentTray[i] !== null) {
      continue;
    }

    const currentTotal = totalInTray;
    const currentVowels = vowelsInTray;
    const currentRatio = currentTotal > 0 ? currentVowels / currentTotal : 0;

    let preferVowels = currentRatio < targetVowelRatio;

    let letter: Letter;

    if (preferVowels) {
      // Generate a vowel using the language class
      const letterValue = language.getRandomVowel();
      letter = {
        id: crypto.randomUUID(),
        value: letterValue,
      };
      if (language.isVowel(letterValue)) {
        vowelsInTray++;
      }
    } else {
      // Generate a consonant using the language class
      const letterValue = language.getRandomConsonant();
      letter = {
        id: crypto.randomUUID(),
        value: letterValue,
      };
    }

    // Insert the new letter into the tray
    currentTray[i] = letter;
    totalInTray++;
  }
}

export async function createInitialGameState(
  playerId: string = "player1",
  languageCode: string = "en"
): Promise<GameState> {
  const { loadLanguage } = await import("./languages");
  const language = await loadLanguage(languageCode as any);

  const tray = new Array(TRAY_SIZE).fill(null);
  fillTray(tray, language);

  // create empty board
  const board: Board = {};
  for (let x = 0; x < BOARD_WIDTH; x++) {
    board[x] = {};
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      board[x][y] = null;
    }
  }

  // Initialize board with "SCRAMBLE" in the middle
  const word = "SCRAMBLE";
  const startX = Math.floor((BOARD_WIDTH - word.length) / 2);
  const middleY = Math.floor(BOARD_HEIGHT / 2);

  word.split("").forEach((letter, index) => {
    const x = startX + index;
    console.log(x, middleY);

    board[x][middleY] = {
      id: crypto.randomUUID(),
      value: letter,
    };
  });

  console.log("init", board);

  return {
    board,
    players: {
      [playerId]: {
        letters: tray,
      },
    },
    language: languageCode,
  };
}
