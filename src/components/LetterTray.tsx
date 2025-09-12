import React, { useState, useEffect } from "react";
import type { Letter } from "../types";
import { LetterView } from "./Letter";
import { TRAY_SIZE } from "../config";

interface LetterTrayProps {
  letters: (Letter | null)[];
  onLetterClick: (letter: Letter) => void;
  hasTemporaryPlacements: boolean;
  onAccept: () => void;
  onReject: () => void;
  onBackspace: () => void;
}

export const LetterTray: React.FC<LetterTrayProps> = ({
  letters,
  onLetterClick,
  hasTemporaryPlacements,
  onAccept,
  onReject,
  onBackspace,
}) => {
  // Create a fixed array of slots to maintain positions - pad with nulls if needed
  const letterSlots = Array.from(
    { length: TRAY_SIZE },
    (_, index) => letters[index] || null
  );

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonSize = Math.max(Math.min(screenWidth / 12, 48), 36);
  const actionButtonHeight = Math.max(Math.min(screenWidth / 15, 40), 32);

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg max-w-full">
      {/* Top row: Letters + Delete button */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
        {/* Letter slots */}
        {letterSlots.map((letter, index) => (
          <LetterView
            key={index}
            letter={letter}
            onClick={() => letter && onLetterClick(letter)}
            variant="tray"
          />
        ))}

        {/* Delete button */}
        <button
          onClick={onBackspace}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 rounded-lg font-bold"
          style={{
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            fontSize: `${buttonSize * 0.375}px`,
          }}
          title="Backspace"
        >
          ⌫
        </button>
      </div>

      {/* Bottom row: Accept and Reject buttons (right aligned) */}
      <div className="flex justify-end gap-1 sm:gap-2">
        <button
          onClick={onAccept}
          disabled={!hasTemporaryPlacements}
          className={`
            rounded-lg font-bold
            ${
              hasTemporaryPlacements
                ? "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
          style={{
            width: `${buttonSize}px`,
            height: `${actionButtonHeight}px`,
            fontSize: `${actionButtonHeight * 0.5}px`,
          }}
          title="Accept"
        >
          ✓
        </button>

        <button
          onClick={onReject}
          disabled={!hasTemporaryPlacements}
          className={`
            rounded-lg font-bold 
            ${
              hasTemporaryPlacements
                ? "bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
          style={{
            width: `${buttonSize}px`,
            height: `${actionButtonHeight}px`,
            fontSize: `${actionButtonHeight * 0.5}px`,
          }}
          title="Reject"
        >
          ✗
        </button>
      </div>
    </div>
  );
};
