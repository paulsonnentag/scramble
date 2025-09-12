import type { Letter, GameState } from "./types";
import {
  LETTER_DISTRIBUTION,
  VOWELS,
  TRAY_SIZE,
  TARGET_VOWEL_RATIO,
  type LetterKey,
} from "./config";

let nextLetterId = 0;

export function generateRandomLetter(): Letter {
  // Get all available letters with their relative weights (counts)
  const letterOptions: LetterKey[] = [];

  Object.entries(LETTER_DISTRIBUTION).forEach(([letter, { count }]) => {
    // Add each letter multiple times based on its distribution count
    for (let i = 0; i < count; i++) {
      letterOptions.push(letter as LetterKey);
    }
  });

  // Pick a random letter from the weighted distribution
  const randomIndex = Math.floor(Math.random() * letterOptions.length);
  const selectedLetter = letterOptions[randomIndex];

  return {
    id: `${selectedLetter}-${nextLetterId++}`,
    value: selectedLetter,
  };
}
export function fillTray(currentTray: (Letter | null)[]): void {
  // Balance vowels and consonants
  let vowelsInTray = currentTray.filter(
    (l) => l !== null && VOWELS.includes(l.value as any)
  ).length;
  let totalInTray = currentTray.filter((l) => l !== null).length;

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

    let selectedLetter: Letter;

    if (preferVowels) {
      // Generate a vowel
      selectedLetter = generateRandomVowel();
      vowelsInTray++;
    } else {
      // Generate a consonant
      selectedLetter = generateRandomConsonant();
    }

    // Insert the new letter into the tray
    currentTray[i] = selectedLetter;
    totalInTray++;
  }
}

function generateRandomVowel(): Letter {
  const vowelOptions: LetterKey[] = [];

  VOWELS.forEach((vowel) => {
    const letterData = LETTER_DISTRIBUTION[vowel];
    // Add each vowel multiple times based on its distribution count
    for (let i = 0; i < letterData.count; i++) {
      vowelOptions.push(vowel);
    }
  });

  const randomIndex = Math.floor(Math.random() * vowelOptions.length);
  const selectedLetter = vowelOptions[randomIndex];

  return {
    id: `${selectedLetter}-${nextLetterId++}`,
    value: selectedLetter,
  };
}

function generateRandomConsonant(): Letter {
  const consonantOptions: LetterKey[] = [];

  Object.entries(LETTER_DISTRIBUTION).forEach(([letter, { count }]) => {
    if (!VOWELS.includes(letter as any)) {
      // Add each consonant multiple times based on its distribution count
      for (let i = 0; i < count; i++) {
        consonantOptions.push(letter as LetterKey);
      }
    }
  });

  const randomIndex = Math.floor(Math.random() * consonantOptions.length);
  const selectedLetter = consonantOptions[randomIndex];

  return {
    id: `${selectedLetter}-${nextLetterId++}`,
    value: selectedLetter,
  };
}

export function createInitialGameState(
  playerId: string = "player1"
): GameState {
  const initialTray = new Array(TRAY_SIZE).fill(null);
  fillTray(initialTray);

  return {
    board: {},
    players: {
      [playerId]: {
        tray: initialTray,
        selectedCell: null,
        placementDirection: "horizontal",
        temporaryPlacements: {},
      },
    },
  };
}
