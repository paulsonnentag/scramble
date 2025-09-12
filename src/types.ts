export interface Letter {
  id: string;
  value: string;
}

export type BoardGrid = { [x: number]: { [y: number]: Letter } };

export type LetterGrid = { [x: number]: { [y: number]: Letter } };

export type PlayerState = {
  tray: (Letter | null)[];
  selectedCell: { x: number; y: number } | null;
  placementDirection: "horizontal" | "vertical";
  temporaryPlacements: LetterGrid;
};

export interface GameState {
  board: BoardGrid;
  players: { [playerId: string]: PlayerState };
}
