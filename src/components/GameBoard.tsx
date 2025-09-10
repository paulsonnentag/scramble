import React, { useState, useEffect } from "react";
import type { PlacedLetter } from "../types";
import { Letter } from "./Letter";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../config";

interface GameBoardProps {
  board: (PlacedLetter | null)[][];
  temporaryPlacements: PlacedLetter[];
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

  const getCellContent = (x: number, y: number) => {
    // Check for permanent letter first
    const permanentLetter = board[y][x];
    if (permanentLetter) return permanentLetter;

    // Check for temporary placement
    const tempLetter = temporaryPlacements.find((p) => p.x === x && p.y === y);
    return tempLetter || null;
  };

  const highlightedCells = getHighlightedCells();

  const [cellSize, setCellSize] = useState(32);

  const calculateCellSize = () => {
    // Calculate responsive cell size based on screen width
    // Aim for the grid to fit within viewport with some padding
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const availableWidth = Math.min(screenWidth - 32, 640); // 32px padding, max 640px
    const cellSize = Math.floor(availableWidth / BOARD_WIDTH) - 4; // 4px for gap
    return Math.max(cellSize, 16); // Minimum 16px cell size
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
            const letter = getCellContent(x, y);
            const isTemporary = letter?.isTemporary;

            return <Letter key={cellKey} letter={letter} onClick={() => onCellSelect(x, y)} isSelected={isSelected} isHighlighted={isHighlighted} isTemporary={isTemporary} variant="board" cellSize={cellSize} />;
          })
        )}
      </div>
    </div>
  );
};
