import React, { useMemo } from "react";
import type { Board, TemporaryPlacement } from "../types";
import { mergeBoardWithTemporaryPlacements } from "../utils";
import { LetterView } from "./Letter";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../config";

type GameBoardProps = {
  board: Board;
  temporaryPlacement?: TemporaryPlacement;
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
  temporaryPlacement,
  onCellSelect,
}) => {
  const mergedBoard = useMemo(
    () =>
      temporaryPlacement
        ? mergeBoardWithTemporaryPlacements(board, temporaryPlacement)
        : board,
    [board, temporaryPlacement]
  );

  return (
    <div className="bg-gray-200" style={GRID_STYLE}>
      {Object.values(mergedBoard).map((col, x) =>
        Object.values(col).map((cell, y) => {
          const cellKey = `${x}-${y}`;

          return (
            <div
              key={cellKey}
              className="bg-gray-100 w-full h-full"
              style={{ gridColumn: x + 1, gridRow: y + 1 }}
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
