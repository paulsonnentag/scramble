import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { TRAY_SIZE } from "../config";
import { loadLanguage } from "../languages";
import { Language } from "../languages/Language";
import type { GameState } from "../types";
import { GameBoard } from "./GameBoard";
import { LetterTray } from "./LetterTray";

const BORD_SIZE = {
  margin: "auto",
  width: `min(100%, calc(100vh - (100vw / ${TRAY_SIZE}) - 100px))`,
  height: "min(100%, 100vw)",
};

export const App = ({ url }: { url: AutomergeUrl }) => {
  const [doc, changeDoc] = useDocument<GameState>(url, { suspense: true });
  const [language, setLanguage] = useState<Language | null>(null);
  const playerId = "player1"; // For now, assume single player

  const player = doc.players[playerId];

  // Load language when doc changes
  useEffect(() => {
    if (doc?.language && !language) {
      loadLanguage(doc.language as any).then(setLanguage);
    }
  }, [doc?.language, language]);

  const hasTemporaryPlacements = !!player.temporaryPlacement;

  // Check if a cell is empty (has no letter)
  const isCellEmpty = useCallback(
    (x: number, y: number): boolean => {
      return !doc.board[x]?.[y];
    },
    [doc.board]
  );

  // Handle cell selection for letter placement
  const handleCellSelect = useCallback(
    (x: number, y: number) => {
      // Only allow selection of empty cells
      if (!isCellEmpty(x, y)) {
        return;
      }

      changeDoc((doc) => {
        const start = { x, y };
        const player = doc.players[playerId];
        const temporaryPlacement = player.temporaryPlacement;

        // If clicking the same position, toggle orientation
        if (
          temporaryPlacement &&
          temporaryPlacement.start.x === x &&
          temporaryPlacement.start.y === y &&
          temporaryPlacement.letters.length === 0
        ) {
          const newOrientation =
            temporaryPlacement.orientation === "horizontal"
              ? "vertical"
              : "horizontal";
          player.temporaryPlacement = {
            start,
            letters: [],
            orientation: newOrientation,
          };
          return;
        }

        // Set new temporary placement for highlighting (empty letters array)
        player.temporaryPlacement = {
          start,
          letters: [],
          orientation: "horizontal",
        };
      });
    },
    [changeDoc, player.temporaryPlacement, isCellEmpty]
  );

  // No need for separate highlighting - temporaryPlacement handles this directly

  if (!language) return <div>Loading language...</div>;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-300">
      <div className="flex-1"></div>

      <div style={BORD_SIZE}>
        <GameBoard
          board={doc.board}
          temporaryPlacement={player.temporaryPlacement}
          onCellSelect={handleCellSelect}
        />
      </div>

      <div className="flex-1"></div>

      <LetterTray
        letters={player.letters}
        canAccept={hasTemporaryPlacements}
        canReject={hasTemporaryPlacements}
        canBackspace={hasTemporaryPlacements}
        onAccept={() => {}}
        onReject={() => {}}
        onBackspace={() => {}}
        onLetterClick={() => {}}
      />
    </div>
  );
};
