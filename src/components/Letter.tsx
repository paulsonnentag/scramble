import React from "react";
import type { Letter } from "../types";
import { getLetterPoints } from "../utils";

interface LetterViewProps {
  letter?: Letter | null;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isTemporary?: boolean;
  variant?: "board" | "tray";
  cellSize?: number; // For responsive board letters
}

export const LetterView: React.FC<LetterViewProps> = ({
  letter,
  onClick,
  disabled = false,
  isSelected = false,
  isHighlighted = false,
  isTemporary = false,
  variant = "board",
  cellSize,
}) => {
  const getClasses = () => {
    const baseClasses =
      "flex flex-col items-center justify-center font-bold relative";

    if (variant === "board") {
      const colorClasses = letter
        ? isTemporary
          ? "bg-yellow-200 text-yellow-800"
          : "bg-yellow-100 text-yellow-800"
        : isSelected
        ? "bg-blue-100"
        : isHighlighted
        ? "bg-gray-200"
        : "bg-gray-50 hover:bg-gray-100";

      return `${baseClasses} rounded ${colorClasses} ${
        onClick ? "cursor-pointer" : ""
      }`;
    } else {
      // tray variant - make responsive
      const colorClasses = letter
        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:scale-105 cursor-pointer shadow-sm"
        : "bg-gray-100 text-gray-400 cursor-not-allowed";

      return `${baseClasses} rounded-lg ${colorClasses}`;
    }
  };

  const getStyle = () => {
    if (variant === "board" && cellSize) {
      const fontSize = Math.max(cellSize * 0.4, 10); // Responsive font size
      return {
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        fontSize: `${fontSize}px`,
      };
    } else if (variant === "tray") {
      // Make tray letters responsive to screen size
      const screenWidth =
        typeof window !== "undefined" ? window.innerWidth : 1024;
      const trayLetterSize = Math.max(Math.min(screenWidth / 12, 48), 36); // Between 36px and 48px
      const fontSize = Math.max(trayLetterSize * 0.375, 14); // Proportional font size

      return {
        width: `${trayLetterSize}px`,
        height: `${trayLetterSize}px`,
        fontSize: `${fontSize}px`,
      };
    }
    return {};
  };

  const isDisabled = disabled || (variant === "tray" && !letter);

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={getClasses()}
      style={getStyle()}
    >
      {letter && (
        <>
          <span>{letter.value}</span>
          <span
            className="absolute bottom-0 right-1"
            style={{
              fontSize:
                variant === "board" && cellSize
                  ? `${Math.max(cellSize * 0.2, 8)}px`
                  : variant === "tray"
                  ? `${Math.max(
                      (typeof window !== "undefined"
                        ? Math.max(Math.min(window.innerWidth / 12, 48), 36)
                        : 36) * 0.25,
                      10
                    )}px`
                  : "0.75rem",
            }}
          >
            {getLetterPoints(letter.value)}
          </span>
        </>
      )}
    </button>
  );
};
