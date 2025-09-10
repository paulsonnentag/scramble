export interface Letter {
  id: string;
  letter: string;
  points: number;
}

export interface PlacedLetter extends Letter {
  x: number;
  y: number;
  isTemporary?: boolean;
  originalTrayIndex?: number;
}

export interface GameState {
  board: (PlacedLetter | null)[][];
  tray: (Letter | null)[];
  selectedCell: { x: number; y: number } | null;
  placementDirection: "horizontal" | "vertical";
  temporaryPlacements: PlacedLetter[];
  availableLetters: Letter[];
}
