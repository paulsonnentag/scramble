import React from "react";
import type { Letter as LetterType } from "../types";
import { Letter } from "./Letter";
import { TRAY_SIZE } from "../config";

interface LetterTrayProps {
  letters: (LetterType | null)[];
  onLetterClick: (letter: LetterType) => void;
  hasTemporaryPlacements: boolean;
  onAccept: () => void;
  onReject: () => void;
  onBackspace: () => void;
}

export const LetterTray: React.FC<LetterTrayProps> = ({ letters, onLetterClick, hasTemporaryPlacements, onAccept, onReject, onBackspace }) => {
  // Create a fixed array of slots to maintain positions
  const letterSlots = Array.from({ length: TRAY_SIZE }, (_, index) => letters[index] || null);

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg max-w-full">
      {/* Top row: Letters + Delete button */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
        {/* Letter slots */}
        {letterSlots.map((letter, index) => (
          <Letter key={index} letter={letter} onClick={() => letter && onLetterClick(letter)} variant="tray" />
        ))}

        {/* Delete button */}
        <button onClick={onBackspace} className="w-12 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 rounded-lg font-bold transition-all duration-200" title="Backspace">
          ⌫
        </button>
      </div>

      {/* Bottom row: Accept and Reject buttons (right aligned) */}
      <div className="flex justify-end gap-1 sm:gap-2">
        <button
          onClick={onAccept}
          disabled={!hasTemporaryPlacements}
          className={`
            w-12 h-10 rounded-lg font-bold transition-all duration-200
            ${hasTemporaryPlacements ? "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
          title="Accept"
        >
          ✓
        </button>

        <button
          onClick={onReject}
          disabled={!hasTemporaryPlacements}
          className={`
            w-12 h-10 rounded-lg font-bold transition-all duration-200
            ${hasTemporaryPlacements ? "bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105" : "bg-gray-100 text-gray-400 cursor-not-allowed"}
          `}
          title="Reject"
        >
          ✗
        </button>
      </div>
    </div>
  );
};
