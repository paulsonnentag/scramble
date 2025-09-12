export interface LetterDistribution {
  [letter: string]: {
    probability: number; // 0-1 probability of this letter appearing
    points: number;
  };
}

export interface LanguageDescription {
  code: string;
  name: string;
  flag: string; // Emoji flag
}

export abstract class Language {
  protected wordSet: Set<string>;

  constructor(wordList: string[]) {
    // Convert all words to uppercase and store in a Set for fast lookup
    this.wordSet = new Set(wordList.map((word) => word.toUpperCase().trim()));
  }

  /**
   * Returns the letter distribution for this language
   * Each letter has a count (frequency) and point value
   */
  abstract getLetterDistribution(): LetterDistribution;

  /**
   * Returns the point value for a given letter
   * @param letter - The letter to get points for
   * @returns The point value, or 0 if letter is not found
   */
  getLetterPoints(letter: string): number {
    const distribution = this.getLetterDistribution();
    const upperLetter = letter.toUpperCase();
    return distribution[upperLetter]?.points || 0;
  }

  /**
   * Checks if a word is valid in this language
   * @param word - The word to validate
   * @returns True if the word is valid, false otherwise
   */
  isValidWord(word: string): boolean {
    const upperWord = word.toUpperCase().trim();
    return this.wordSet.has(upperWord);
  }

  /**
   * Gets all valid words (useful for debugging)
   * @returns Array of all valid words
   */
  getAllWords(): string[] {
    return Array.from(this.wordSet);
  }

  /**
   * Gets the total number of valid words
   * @returns Number of valid words
   */
  getWordCount(): number {
    return this.wordSet.size;
  }

  /**
   * Gets a random vowel based on the language's letter distribution
   * @returns A random vowel letter
   */
  getRandomVowel(): string {
    const vowels = ["A", "E", "I", "O", "U"];
    const distribution = this.getLetterDistribution();

    // Filter vowels that exist in this language's distribution
    const availableVowels = vowels.filter((vowel) => distribution[vowel]);

    if (availableVowels.length === 0) {
      return "A"; // Fallback
    }

    // Create weighted array based on probabilities
    const weightedVowels: string[] = [];
    availableVowels.forEach((vowel) => {
      const probability = distribution[vowel].probability;
      const weight = Math.round(probability * 100); // Convert to integer weight
      for (let i = 0; i < weight; i++) {
        weightedVowels.push(vowel);
      }
    });

    return weightedVowels[Math.floor(Math.random() * weightedVowels.length)];
  }

  /**
   * Gets a random consonant based on the language's letter distribution
   * @returns A random consonant letter
   */
  getRandomConsonant(): string {
    const vowels = new Set(["A", "E", "I", "O", "U"]);
    const distribution = this.getLetterDistribution();

    // Get all consonants from the distribution
    const consonants = Object.keys(distribution).filter(
      (letter) => !vowels.has(letter)
    );

    if (consonants.length === 0) {
      return "B"; // Fallback
    }

    // Create weighted array based on probabilities
    const weightedConsonants: string[] = [];
    consonants.forEach((consonant) => {
      const probability = distribution[consonant].probability;
      const weight = Math.round(probability * 100); // Convert to integer weight
      for (let i = 0; i < weight; i++) {
        weightedConsonants.push(consonant);
      }
    });

    return weightedConsonants[
      Math.floor(Math.random() * weightedConsonants.length)
    ];
  }
}
