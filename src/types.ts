export type Position = { x: number; y: number };

export type Letter = {
  id: string;
  value: string;
};

export type Orientation = "horizontal" | "vertical";

export type Word = {
  start: Position;
  letters: (Letter | null)[];
  orientation: Orientation;
};

export type PlayerState = {
  letters: (Letter | null)[];
  word?: Word;
};

export interface GameState {
  placedWords: Word[];
  players: { [playerId: string]: PlayerState };
  language: string; // Language code (e.g., "en", "de")
}
