import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useCallback, useEffect } from "react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  KEY_ACCEPT,
  KEY_BACKSPACE,
  KEY_REJECT,
} from "../config";
import { fillTray } from "../letters";
import type { GameState, Letter } from "../types";
import { toJS } from "../utils";
import { GameBoard } from "./GameBoard";
import { LetterTray } from "./LetterTray";

export const App = ({ url }: { url: AutomergeUrl }) => {
  const [doc, changeDoc] = useDocument<GameState>(url);
  const playerId = "player1"; // For now, assume single player

  const handleCellSelect = useCallback(
    (x: number, y: number) => {
      changeDoc((doc) => {
        const player = doc.players[playerId];
        if (!player) return;

        if (player.selectedCell?.x === x && player.selectedCell?.y === y) {
          // Toggle direction if clicking the same cell
          player.placementDirection =
            player.placementDirection === "horizontal"
              ? "vertical"
              : "horizontal";
        } else {
          // Select new cell
          player.selectedCell = { x, y };
        }
      });
    },
    [changeDoc, playerId]
  );

  const handleLetterClick = useCallback(
    (letter: Letter) => {
      changeDoc((doc) => {
        const player = doc.players[playerId];
        if (!player || !player.selectedCell) return;

        const { x, y } = player.selectedCell;

        // Check if cell is already occupied (board or temporary)
        if (doc.board[x]?.[y] || player.temporaryPlacements[x]?.[y]) return;

        // Find and remove letter from tray
        const letterIndex = player.tray.findIndex(
          (letter) => letter?.id === letter?.id
        );
        if (letterIndex === -1) return;

        player.tray[letterIndex] = null;

        // Place letter temporarily
        if (!player.temporaryPlacements[x]) {
          player.temporaryPlacements[x] = {};
        }
        player.temporaryPlacements[x][y] = toJS(letter);

        // Move to next position
        const nextX = player.placementDirection === "horizontal" ? x + 1 : x;
        const nextY = player.placementDirection === "vertical" ? y + 1 : y;

        if (nextX < BOARD_WIDTH && nextY < BOARD_HEIGHT) {
          player.selectedCell = { x: nextX, y: nextY };
        }
      });
    },
    [changeDoc, playerId]
  );

  const handleAcceptPlacements = useCallback(() => {
    changeDoc((doc) => {
      const player = doc.players[playerId];
      if (!player) return;

      // Move temporary placements to board
      Object.keys(player.temporaryPlacements).forEach((xStr) => {
        const x = parseInt(xStr);
        Object.keys(player.temporaryPlacements[x]).forEach((yStr) => {
          const y = parseInt(yStr);
          const letter = player.temporaryPlacements[x][y];

          if (!doc.board[x]) {
            doc.board[x] = {};
          }
          doc.board[x][y] = toJS(letter);
        });
      });

      player.temporaryPlacements = {};
      fillTray(player.tray);
    });
  }, [changeDoc, playerId]);

  const handleRejectPlacements = useCallback(() => {
    changeDoc((doc) => {
      const player = doc.players[playerId];
      if (!player) return;

      // Return letters from temporary placements back to tray
      Object.keys(player.temporaryPlacements).forEach((xStr) => {
        const x = parseInt(xStr);
        Object.keys(player.temporaryPlacements[x]).forEach((yStr) => {
          const y = parseInt(yStr);
          const letter = player.temporaryPlacements[x][y];
          player.tray.push(toJS(letter));
        });
      });

      // Clear temporary placements
      player.temporaryPlacements = {};
    });
  }, [changeDoc, playerId]);

  const handleBackspace = useCallback(() => {
    changeDoc((doc) => {
      const player = doc.players[playerId];
      if (!player) return;

      // Find the last placed letter (in reverse order)
      let lastX: number | null = null;
      let lastY: number | null = null;
      let lastLetter: Letter | null = null;

      // Iterate through temporary placements to find the last one
      Object.keys(player.temporaryPlacements).forEach((xStr) => {
        const x = parseInt(xStr);
        Object.keys(player.temporaryPlacements[x]).forEach((yStr) => {
          const y = parseInt(yStr);
          lastX = x;
          lastY = y;
          lastLetter = player.temporaryPlacements[x][y];
        });
      });

      if (lastX !== null && lastY !== null && lastLetter) {
        // Return letter to tray
        player.tray.push(toJS(lastLetter));

        // Remove from temporary placements
        delete player.temporaryPlacements[lastX][lastY];
        if (Object.keys(player.temporaryPlacements[lastX]).length === 0) {
          delete player.temporaryPlacements[lastX];
        }

        // Move selection back to the removed letter's position
        player.selectedCell = { x: lastX, y: lastY };
      }
    });
  }, [changeDoc, playerId]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!doc) return;

      const player = doc.players[playerId];
      if (!player) return;

      const key = event.key.toUpperCase();

      // Handle backspace
      if (event.key === KEY_BACKSPACE) {
        event.preventDefault();
        handleBackspace();
        return;
      }

      // Handle enter for accept
      if (event.key === KEY_ACCEPT) {
        event.preventDefault();
        const hasTemporaryPlacements =
          Object.keys(player.temporaryPlacements).length > 0;
        if (hasTemporaryPlacements) {
          handleAcceptPlacements();
        }
        return;
      }

      // Handle escape for reject
      if (event.key === KEY_REJECT) {
        event.preventDefault();
        const hasTemporaryPlacements =
          Object.keys(player.temporaryPlacements).length > 0;
        if (hasTemporaryPlacements) {
          handleRejectPlacements();
        }
        return;
      }

      // Handle letter keys
      if (key.length === 1 && key >= "A" && key <= "Z") {
        event.preventDefault();

        // Find the letter in the tray
        const availableLetter = player.tray.find(
          (letter) => letter?.value === key
        );
        if (availableLetter) {
          handleLetterClick(availableLetter);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [
    doc,
    playerId,
    handleBackspace,
    handleAcceptPlacements,
    handleRejectPlacements,
    handleLetterClick,
  ]);

  if (!doc) return <div>Loading...</div>;

  const player = doc.players[playerId];
  if (!player) return <div>Player not found</div>;

  const hasTemporaryPlacements =
    Object.keys(player.temporaryPlacements).length > 0;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main game area - centered */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 pb-32">
        <GameBoard
          board={doc.board}
          temporaryPlacements={player.temporaryPlacements}
          selectedCell={player.selectedCell}
          placementDirection={player.placementDirection}
          onCellSelect={handleCellSelect}
        />
      </div>

      {/* Letter tray - sticky to bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <LetterTray
            letters={player.tray}
            onLetterClick={handleLetterClick}
            hasTemporaryPlacements={hasTemporaryPlacements}
            onAccept={handleAcceptPlacements}
            onReject={handleRejectPlacements}
            onBackspace={handleBackspace}
          />
        </div>
      </div>
    </div>
  );
};
