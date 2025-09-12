import type { Letter, GameState } from "./types";
import { TRAY_SIZE, TARGET_VOWEL_RATIO } from "./config";
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

  const initialTray = new Array(TRAY_SIZE).fill(null);
  fillTray(initialTray, language);

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
    language: languageCode,
  };
}
