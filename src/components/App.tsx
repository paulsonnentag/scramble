import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  computeBoardFromWords,
  findEmptyTraySlot,
  getNextAvailablePosition,
  getSuggestedOrientation,
  isValidOrientation,
  moveWordLettersToTray,
} from "../board";
import { TRAY_SIZE } from "../config";
import { loadLanguage } from "../languages";
import { Language } from "../languages/Language";
import { fillTray } from "../letters";
import type { GameState } from "../types";
import { toJS } from "../utils";
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

  const hasCurrentWord = !!player.word;

  // Concatenate placed words with current word if it exists
  const allWords = useMemo(
    () => (player.word ? [player.word, ...doc.placedWords] : doc.placedWords),
    [doc.placedWords, player.word]
  );

  // Compute the current board state
  const board = useMemo(() => computeBoardFromWords(allWords), [allWords]);

  // Handle cell selection for letter placement
  const handleCellSelect = useCallback(
    (x: number, y: number) => {
      // Only allow selection of empty cells
      if (board[x]?.[y]) {
        return;
      }

      changeDoc((doc) => {
        const start = { x, y };
        const player = doc.players[playerId];
        const currentWord = player.word;

        // Check if there are already letters placed in the current word
        const hasPlacedLetters =
          currentWord && currentWord.letters.some((letter) => letter !== null);

        // If clicking the same position, toggle orientation (only if no letters are placed)
        if (
          currentWord &&
          currentWord.start.x === x &&
          currentWord.start.y === y &&
          !hasPlacedLetters
        ) {
          // Try to toggle orientation, but only if the new orientation is valid
          const newOrientation =
            currentWord.orientation === "horizontal"
              ? "vertical"
              : "horizontal";

          // Check if the new orientation would be valid at this position
          const currentBoard = computeBoardFromWords(doc.placedWords);
          const isNewOrientationValid = isValidOrientation(
            currentBoard,
            { x, y },
            newOrientation
          );

          if (isNewOrientationValid) {
            player.word = {
              start,
              letters: [],
              orientation: newOrientation,
            };
          }
          return;
        }

        // Get suggested orientation for the new position
        const suggestedOrientation = getSuggestedOrientation(board, { x, y });

        // If no valid orientation, don't allow word creation
        if (!suggestedOrientation) {
          return;
        }

        // If there are letters in current word, try to move the word position
        if (hasPlacedLetters) {
          moveWordLettersToTray(toJS(currentWord), player.letters);
        }

        // Set new word for highlighting (empty letters array)
        player.word = {
          start,
          letters: [],
          orientation: suggestedOrientation,
        };
      });
    },
    [changeDoc, player.word, board, playerId]
  );

  // Handle letter placement
  const placeLetter = useCallback(
    (trayIndex: number) => {
      if (!player.word) return;

      const letter = player.letters[trayIndex];
      if (!letter) return;

      const nextPosition = getNextAvailablePosition(player.word, board);
      if (!nextPosition) return;

      changeDoc((doc) => {
        const currentPlayer = doc.players[playerId];
        const currentWord = currentPlayer.word;
        if (!currentWord) return;

        // Calculate the index in the word letters array
        const { start, orientation } = currentWord;
        let wordIndex: number;

        if (orientation === "horizontal") {
          wordIndex = nextPosition.x - start.x;
        } else {
          wordIndex = nextPosition.y - start.y;
        }

        // Extend letters array if needed
        while (currentWord.letters.length <= wordIndex) {
          currentWord.letters.push(null);
        }

        // Place the letter
        currentWord.letters[wordIndex] = toJS(letter);

        // Remove letter from tray
        currentPlayer.letters[trayIndex] = null;
      });
    },
    [changeDoc, playerId, player.word, board]
  );

  // Handle letter removal (backspace)
  const handleBackspace = useCallback(() => {
    if (!player.word) return;

    changeDoc((doc) => {
      const currentPlayer = doc.players[playerId];
      const currentWord = currentPlayer.word;
      if (!currentWord || currentWord.letters.length === 0) return;

      // Find the last placed letter
      let lastIndex = -1;
      for (let i = currentWord.letters.length - 1; i >= 0; i--) {
        if (currentWord.letters[i] !== null) {
          lastIndex = i;
          break;
        }
      }

      if (lastIndex === -1) return;

      // Get the letter to return to tray
      const letterToReturn = currentWord.letters[lastIndex];
      if (!letterToReturn) return;

      // Find empty spot in tray
      const emptyTraySlot = findEmptyTraySlot(currentPlayer.letters);
      if (emptyTraySlot !== -1) {
        currentPlayer.letters[emptyTraySlot] = toJS(letterToReturn);
      }

      // Remove letter from word
      currentWord.letters[lastIndex] = null;

      // Trim trailing nulls
      while (
        currentWord.letters.length > 0 &&
        currentWord.letters[currentWord.letters.length - 1] === null
      ) {
        currentWord.letters.pop();
      }
    });
  }, [changeDoc, playerId, player.word]);

  // Handle letter placement via keyboard
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!player.word) return;

      const key = event.key.toUpperCase();

      // Handle backspace
      if (key === "BACKSPACE") {
        event.preventDefault();
        handleBackspace();
        return;
      }

      // Handle letter placement
      if (key.length === 1 && key >= "A" && key <= "Z") {
        event.preventDefault();

        // Find the letter in the tray
        const trayIndex = player.letters.findIndex(
          (letter) => letter?.value.toUpperCase() === key
        );
        if (trayIndex === -1) return;

        placeLetter(trayIndex);
      }
    },
    [player.word, player.letters, handleBackspace, placeLetter]
  );

  // Handle word acceptance
  const handleAccept = useCallback(() => {
    if (!player.word || player.word.letters.length === 0) return;

    // Check if word has any letters
    const hasLetters = player.word.letters.some((letter) => letter !== null);
    if (!hasLetters) return;

    changeDoc((doc) => {
      const currentPlayer = doc.players[playerId];
      const currentWord = currentPlayer.word;
      if (!currentWord) return;

      // Add word to placed words
      doc.placedWords.push(toJS(currentWord));

      // Clear current word
      delete currentPlayer.word;

      // Refill tray
      if (language) {
        fillTray(currentPlayer.letters, language);
      }
    });
  }, [changeDoc, playerId, player.word, language]);

  // Handle word rejection
  const handleReject = useCallback(() => {
    if (!player.word) return;

    changeDoc((doc) => {
      const currentPlayer = doc.players[playerId];
      const currentWord = currentPlayer.word;
      if (!currentWord) return;

      // Return all letters to tray
      currentWord.letters.forEach((letter) => {
        if (letter) {
          const emptySlot = findEmptyTraySlot(currentPlayer.letters);
          if (emptySlot !== -1) {
            currentPlayer.letters[emptySlot] = toJS(letter);
          }
        }
      });

      // Clear current word
      delete currentPlayer.word;
    });
  }, [changeDoc, playerId, player.word]);

  // Handle letter tray clicks
  const handleLetterClick = useCallback(
    (index: number) => {
      if (!player.word) return;
      placeLetter(index);
    },
    [player.word, placeLetter]
  );

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (!language) return <div>Loading language...</div>;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-300">
      <div className="flex-1"></div>

      <div style={BORD_SIZE}>
        <GameBoard
          board={board}
          currentWord={player.word}
          onCellSelect={handleCellSelect}
        />
      </div>

      <div className="flex-1"></div>

      <LetterTray
        letters={player.letters}
        canAccept={hasCurrentWord}
        canReject={hasCurrentWord}
        canBackspace={hasCurrentWord}
        onAccept={handleAccept}
        onReject={handleReject}
        onBackspace={handleBackspace}
        onLetterClick={handleLetterClick}
      />
    </div>
  );
};
