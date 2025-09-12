export type LetterDistribution = {
  [letter: string]: {
    probability: number; // 0-1 probability of this letter appearing
    points: number;
    isVowel: boolean;
  };
};

export type LanguageDescription = {
  code: string;
  name: string;
  flag: string; // Emoji flag
};

export class Language {
  #wordSet: Set<string>;
  #distribution: LetterDistribution;
  #vowels: Set<string>;
  #consonants: Set<string>;

  constructor(wordList: string[], letterDistribution: LetterDistribution) {
    // Convert all words to uppercase and store in a Set for fast lookup
    this.#wordSet = new Set(wordList.map((word) => word.toUpperCase().trim()));
    this.#distribution = letterDistribution;

    this.#vowels = new Set();
    this.#consonants = new Set();
    for (const letter of Object.keys(letterDistribution)) {
      if (letterDistribution[letter].isVowel) {
        this.#vowels.add(letter.toUpperCase());
      } else {
        this.#consonants.add(letter.toUpperCase());
      }
    }
  }

  /**
   * Returns the point value for a given letter
   * @param letter - The letter to get points for
   * @returns The point value, or 0 if letter is not found
   */
  getLetterPoints(letter: string): number {
    const upperLetter = letter.toUpperCase();
    return this.#distribution[upperLetter]?.points || 0;
  }

  /**
   * Checks if a word is valid in this language
   * @param word - The word to validate
   * @returns True if the word is valid, false otherwise
   */
  isValidWord(word: string): boolean {
    const upperWord = word.toUpperCase().trim();
    return this.#wordSet.has(upperWord);
  }

  /**
   * Gets the total number of valid words
   * @returns Number of valid words
   */

  /**
   * Gets a random vowel based on the language's letter distribution
   * @returns A random vowel letter
   */
  getRandomVowel(): string {
    return drawRandomLetterFromSet(this.#vowels, this.#distribution);
  }

  /**
   * Gets a random consonant based on the language's letter distribution
   * @returns A random consonant letter
   */
  getRandomConsonant(): string {
    return drawRandomLetterFromSet(this.#consonants, this.#distribution);
  }

  isVowel(letter: string): boolean {
    return this.#vowels.has(letter.toUpperCase());
  }

  isConsonant(letter: string): boolean {
    return this.#consonants.has(letter.toUpperCase());
  }
}

/**
 * Shared helper function to draw a random letter from a set based on distribution
 * @param availableLetters - Set of letters to choose from
 * @param distribution - The letter distribution
 * @returns A random letter from the set
 */
export function drawRandomLetterFromSet(
  availableLetters: Set<string>,
  distribution: LetterDistribution
): string {
  // Filter distribution to only include available letters
  const filteredLetters = Array.from(availableLetters).filter(
    (letter) => distribution[letter]
  );

  // Create cumulative probability array
  const probabilities = filteredLetters.map(
    (letter) => distribution[letter].probability
  );
  const cumulativeProbabilities: number[] = [];
  let sum = 0;

  for (const prob of probabilities) {
    sum += prob;
    cumulativeProbabilities.push(sum);
  }

  // Generate random number and find corresponding letter
  const random = Math.random() * sum;

  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (random <= cumulativeProbabilities[i]) {
      return filteredLetters[i];
    }
  }

  return filteredLetters[0]; // Fallback
}
