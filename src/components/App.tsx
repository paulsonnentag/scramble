import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useCallback, useEffect } from "react";
import { GameBoard, LetterTray } from ".";
import { drawLetters } from "../letters";
import type { GameState, Letter, PlacedLetter } from "../types";
import { BOARD_WIDTH, BOARD_HEIGHT, KEY_ACCEPT, KEY_REJECT, KEY_BACKSPACE } from "../config";

export const App = ({ url }: { url: AutomergeUrl }) => {
  const [doc, changeDoc] = useDocument<GameState>(url);

  const handleCellSelect = useCallback(
    (x: number, y: number) => {
      changeDoc((doc) => {
        if (doc.selectedCell?.x === x && doc.selectedCell?.y === y) {
          // Toggle direction if clicking the same cell
          doc.placementDirection = doc.placementDirection === "horizontal" ? "vertical" : "horizontal";
        } else {
          // Select new cell
          doc.selectedCell = { x, y };
        }
      });
    },
    [changeDoc]
  );

  const handleLetterClick = useCallback(
    (letter: Letter) => {
      changeDoc((doc) => {
        if (!doc.selectedCell) return;

        const { x, y } = doc.selectedCell;

        // Check if cell is already occupied
        if (doc.board[y][x] !== null) return;

        // Find and mark letter as used (maintain order by setting to null instead of removing)
        const letterIndex = doc.tray.findIndex((l) => l && l.id === letter.id);
        if (letterIndex === -1) return;

        doc.tray[letterIndex] = null as any; // Mark slot as empty

        // Place letter temporarily
        const placedLetter: PlacedLetter = {
          ...letter,
          x,
          y,
          isTemporary: true,
          originalTrayIndex: letterIndex,
        };

        doc.temporaryPlacements.push(placedLetter);

        // Move to next position
        const nextX = doc.placementDirection === "horizontal" ? x + 1 : x;
        const nextY = doc.placementDirection === "vertical" ? y + 1 : y;

        if (nextX < BOARD_WIDTH && nextY < BOARD_HEIGHT) {
          doc.selectedCell = { x: nextX, y: nextY };
        }
      });
    },
    [changeDoc]
  );

  const handleAcceptPlacements = useCallback(() => {
    changeDoc((doc) => {
      // Move temporary placements to board
      doc.temporaryPlacements.forEach((placement) => {
        doc.board[placement.y][placement.x] = {
          ...placement,
          isTemporary: false,
        };
      });

      doc.temporaryPlacements = [];

      // Refill tray - count empty slots and fill them
      const emptySlots = doc.tray.filter((slot) => slot === null).length;
      if (emptySlots > 0) {
        const currentLetters = doc.tray.filter((slot) => slot !== null) as Letter[];
        const { drawn, remaining } = drawLetters(doc.availableLetters, emptySlots, currentLetters);

        // Fill empty slots with new letters
        let drawnIndex = 0;
        for (let i = 0; i < doc.tray.length && drawnIndex < drawn.length; i++) {
          if (doc.tray[i] === null) {
            doc.tray[i] = drawn[drawnIndex++];
          }
        }

        doc.availableLetters = remaining;
      }
    });
  }, [changeDoc]);

  const handleRejectPlacements = useCallback(() => {
    changeDoc((doc) => {
      // Return letters to their original positions in tray
      doc.temporaryPlacements.forEach((placement) => {
        if (placement.originalTrayIndex !== undefined) {
          doc.tray[placement.originalTrayIndex] = {
            id: placement.id,
            letter: placement.letter,
            points: placement.points,
          };
        }
      });

      doc.temporaryPlacements = [];
    });
  }, [changeDoc]);

  const handleBackspace = useCallback(() => {
    changeDoc((doc) => {
      if (doc.temporaryPlacements.length === 0) return;

      // Remove the last placed letter
      const lastPlacement = doc.temporaryPlacements.pop();
      if (lastPlacement) {
        // Return letter to its original tray position
        if (lastPlacement.originalTrayIndex !== undefined) {
          doc.tray[lastPlacement.originalTrayIndex] = {
            id: lastPlacement.id,
            letter: lastPlacement.letter,
            points: lastPlacement.points,
          };
        }

        // Move selection back to the removed letter's position
        doc.selectedCell = { x: lastPlacement.x, y: lastPlacement.y };
      }
    });
  }, [changeDoc]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!doc) return;

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
        if (doc.temporaryPlacements.length > 0) {
          handleAcceptPlacements();
        }
        return;
      }

      // Handle escape for reject
      if (event.key === KEY_REJECT) {
        event.preventDefault();
        if (doc.temporaryPlacements.length > 0) {
          handleRejectPlacements();
        }
        return;
      }

      // Handle letter keys
      if (key.length === 1 && key >= "A" && key <= "Z") {
        event.preventDefault();

        // Find the letter in the tray
        const availableLetter = doc.tray.find((letter) => letter && letter.letter === key);
        if (availableLetter) {
          handleLetterClick(availableLetter);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [doc, handleBackspace, handleAcceptPlacements, handleRejectPlacements, handleLetterClick]);

  if (!doc) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <GameBoard board={doc.board} temporaryPlacements={doc.temporaryPlacements} selectedCell={doc.selectedCell} placementDirection={doc.placementDirection} onCellSelect={handleCellSelect} />

          <LetterTray letters={doc.tray} onLetterClick={handleLetterClick} hasTemporaryPlacements={doc.temporaryPlacements.length > 0} onAccept={handleAcceptPlacements} onReject={handleRejectPlacements} onBackspace={handleBackspace} />
        </div>
      </div>
    </div>
  );
};
