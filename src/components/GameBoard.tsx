import React, { useState, useEffect } from "react";
import type { Letter as LetterType, BoardGrid, LetterGrid } from "../types";
import { LetterView } from "./Letter";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../config";

interface GameBoardProps {
  board: BoardGrid;
  temporaryPlacements: LetterGrid;
  selectedCell: { x: number; y: number } | null;
  placementDirection: "horizontal" | "vertical";
  onCellSelect: (x: number, y: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, temporaryPlacements, selectedCell, placementDirection, onCellSelect }) => {
  const getHighlightedCells = () => {
    if (!selectedCell) return new Set<string>();

    const highlighted = new Set<string>();
    const { x, y } = selectedCell;

    if (placementDirection === "horizontal") {
      // Highlight entire row
      for (let i = 0; i < BOARD_WIDTH; i++) {
        highlighted.add(`${i}-${y}`);
      }
    } else {
      // Highlight entire column
      for (let i = 0; i < BOARD_HEIGHT; i++) {
        highlighted.add(`${x}-${i}`);
      }
    }

    return highlighted;
  };

  const getCellContent = (x: number, y: number): { letter: LetterType | null; isTemporary: boolean } => {
    // Check for permanent letter first
    const permanentLetter = board[x]?.[y];
    if (permanentLetter) return { letter: permanentLetter, isTemporary: false };

    // Check for temporary placement
    const tempLetter = temporaryPlacements[x]?.[y];
    if (tempLetter) return { letter: tempLetter, isTemporary: true };

    return { letter: null, isTemporary: false };
  };

  const highlightedCells = getHighlightedCells();

  const [cellSize, setCellSize] = useState(32);

  const calculateCellSize = () => {
    // Calculate responsive cell size based on both screen width and height

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Account for tray height (approximately 120px) and padding
    const availableHeight = screenHeight - 160; // Tray + padding
    const availableWidth = screenWidth - 32; // Side padding

    // Calculate max cell size based on both dimensions
    const cellSizeByWidth = Math.floor(availableWidth / BOARD_WIDTH) - 4;
    const cellSizeByHeight = Math.floor(availableHeight / BOARD_HEIGHT) - 4;

    // Use the smaller of the two to ensure it fits
    const cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);

    return Math.max(cellSize, 12); // Minimum 12px cell size
  };

  useEffect(() => {
    const updateCellSize = () => {
      setCellSize(calculateCellSize());
    };

    updateCellSize(); // Initial calculation
    window.addEventListener("resize", updateCellSize);

    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  return (
    <div className="bg-gray-500 p-1 rounded-lg shadow-lg">
      <div
        className="mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${cellSize}px)`,
          gap: "0.25rem",
          maxWidth: "100vw",
        }}
      >
        {Array.from({ length: BOARD_HEIGHT }, (_, y) =>
          Array.from({ length: BOARD_WIDTH }, (_, x) => {
            const cellKey = `${x}-${y}`;
            const isSelected = selectedCell?.x === x && selectedCell?.y === y;
            const isHighlighted = highlightedCells.has(cellKey);
            const cellContent = getCellContent(x, y);

            return <LetterView key={cellKey} letter={cellContent.letter} onClick={() => onCellSelect(x, y)} isSelected={isSelected} isHighlighted={isHighlighted} isTemporary={cellContent.isTemporary} variant="board" cellSize={cellSize} />;
          })
        )}
      </div>
    </div>
  );
};
