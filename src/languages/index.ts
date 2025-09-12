import { Language, type LanguageDescription } from "./Language";
import { ENGLISH_LETTER_DISTRIBUTION, ENGLISH_DESCRIPTION } from "./English";
import { GERMAN_LETTER_DISTRIBUTION, GERMAN_DESCRIPTION } from "./German";

export type SupportedLanguage = "en" | "de";

// Array of all supported languages with their descriptions
export const SUPPORTED_LANGUAGES: LanguageDescription[] = [
  ENGLISH_DESCRIPTION,
  GERMAN_DESCRIPTION,
] as const;

/**
 * Loads a language with its word list from the public/words directory
 * @param languageCode - The language code (e.g., "en", "de")
 * @returns Promise that resolves to the Language instance
 */
export async function loadLanguage(
  languageCode: SupportedLanguage
): Promise<Language> {
  try {
    // Fetch the word list from the public directory
    const response = await fetch(`/words/${languageCode}.txt`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch word list for language: ${languageCode}. Status: ${response.status}`
      );
    }

    const text = await response.text();

    // Split by newlines and filter out empty lines
    const words = text
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    console.log(`Loaded ${words.length} words for language: ${languageCode}`);

    // Create the appropriate language instance with distribution
    switch (languageCode) {
      case "en":
        return new Language(words, ENGLISH_LETTER_DISTRIBUTION);
      case "de":
        return new Language(words, GERMAN_LETTER_DISTRIBUTION);
      default:
        throw new Error(`Unsupported language: ${languageCode}`);
    }
  } catch (error) {
    console.error(`Error loading language ${languageCode}:`, error);
    throw error;
  }
}
