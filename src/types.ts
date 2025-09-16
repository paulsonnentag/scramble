export type Position = { x: number; y: number };

export type Letter = {
  id: string;
  value: string;
};

export type Orientation = "horizontal" | "vertical";

export type Board = { [x: number]: { [y: number]: Letter | null } };

export type TemporaryPlacement = {
  start: Position;
  letters: (Letter | null)[];
  orientation: Orientation;
};

export type PlayerState = {
  letters: (Letter | null)[];
  temporaryPlacement?: TemporaryPlacement;
};

export interface GameState {
  board: Board;
  players: { [playerId: string]: PlayerState };
  language: string; // Language code (e.g., "en", "de")
}
