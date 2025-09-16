import React, { useMemo } from "react";
import type { Word } from "../types";
import { computeBoardFromWords, type Board } from "../board";
import { LetterView } from "./Letter";
import { BOARD_HEIGHT, BOARD_WIDTH, TRAY_SIZE } from "../config";

type GameBoardProps = {
  board: Board;
  currentWord?: Word;
  onCellSelect: (x: number, y: number) => void;
};

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
  gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
  gap: "1px",
  aspectRatio: "1/1",
};

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentWord,
  onCellSelect,
}) => {
  // Compute highlighted cells map
  const highlightedCells = useMemo(() => {
    const highlighted = new Map<string, boolean>();

    if (!currentWord) {
      return highlighted;
    }

    const { start, orientation } = currentWord;
    let highlightLength = TRAY_SIZE;

    for (let i = 0; i < highlightLength; i++) {
      let x: number;
      let y: number;

      if (orientation === "horizontal") {
        x = start.x + i;
        y = start.y;
      } else {
        x = start.x;
        y = start.y + i;
      }

      if (x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
        break;
      }

      if (board[x]?.[y]) {
        highlightLength += 1;
        continue;
      }

      const cellKey = `${x}/${y}`;
      highlighted.set(cellKey, true);
    }

    return highlighted;
  }, [currentWord, board]);

  return (
    <div className="bg-gray-200" style={GRID_STYLE}>
      {Object.values(board).map((col, x) =>
        Object.values(col).map((cell, y) => {
          const cellKey = `${x}/${y}`;
          const isHighlighted = highlightedCells.get(cellKey);
          const isEmpty = !cell;

          return (
            <div
              key={cellKey}
              className={`w-full h-full border border-gray-300 ${
                isEmpty
                  ? isHighlighted
                    ? "bg-gray-200 cursor-pointer"
                    : "bg-gray-100 cursor-pointer hover:bg-gray-200"
                  : "bg-gray-100"
              }`}
              style={{ gridColumn: x + 1, gridRow: y + 1 }}
              onClick={() => onCellSelect(x, y)}
            >
              {cell && (
                <LetterView letter={cell} onClick={() => onCellSelect(x, y)} />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
