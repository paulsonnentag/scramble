import type { Letter, GameState } from "./types";
import { LETTER_DISTRIBUTION, VOWELS, CONSONANTS, TRAY_SIZE, TARGET_VOWEL_RATIO, BOARD_WIDTH, BOARD_HEIGHT } from "./config";

export function createLetterBag(): Letter[] {
  const letters: Letter[] = [];
  let id = 0;

  Object.entries(LETTER_DISTRIBUTION).forEach(([letter, { count, points }]) => {
    for (let i = 0; i < count; i++) {
      letters.push({
        id: `${letter}-${id++}`,
        letter,
        points,
      });
    }
  });

  return shuffleArray(letters);
}

export function drawLetters(availableLetters: Letter[], count: number, currentTray: Letter[] = []): { drawn: Letter[]; remaining: Letter[] } {
  // Balance vowels and consonants
  const vowelsInTray = currentTray.filter((l) => VOWELS.includes(l.letter)).length;
  const consonantsInTray = currentTray.filter((l) => !VOWELS.includes(l.letter)).length;
  const totalInTray = currentTray.length;

  const targetVowelRatio = TARGET_VOWEL_RATIO; // Aim for configured vowel ratio
  const currentVowelRatio = totalInTray > 0 ? vowelsInTray / totalInTray : 0;

  const drawn: Letter[] = [];
  const remaining = [...availableLetters];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const currentTotal = totalInTray + drawn.length;
    const currentVowels = vowelsInTray + drawn.filter((l) => VOWELS.includes(l.letter)).length;
    const currentRatio = currentTotal > 0 ? currentVowels / currentTotal : 0;

    let preferVowels = currentRatio < targetVowelRatio;

    // Find suitable letters
    const vowelOptions = remaining.filter((l) => VOWELS.includes(l.letter));
    const consonantOptions = remaining.filter((l) => !VOWELS.includes(l.letter));

    let selectedLetter: Letter;

    if (preferVowels && vowelOptions.length > 0) {
      selectedLetter = vowelOptions[Math.floor(Math.random() * vowelOptions.length)];
    } else if (!preferVowels && consonantOptions.length > 0) {
      selectedLetter = consonantOptions[Math.floor(Math.random() * consonantOptions.length)];
    } else {
      // Fallback to any available letter
      selectedLetter = remaining[Math.floor(Math.random() * remaining.length)];
    }

    drawn.push(selectedLetter);
    const index = remaining.findIndex((l) => l.id === selectedLetter.id);
    remaining.splice(index, 1);
  }

  return { drawn, remaining };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createInitialGameState(): GameState {
  const availableLetters = createLetterBag();
  const { drawn: initialTray, remaining } = drawLetters(availableLetters, TRAY_SIZE);

  return {
    board: Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null)),
    tray: initialTray,
    selectedCell: null,
    placementDirection: "horizontal",
    temporaryPlacements: [],
    availableLetters: remaining,
  };
}
