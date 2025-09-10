import React from "react";
import type { Letter as LetterType } from "../types";

interface LetterProps {
  letter?: LetterType | null;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isTemporary?: boolean;
  variant?: "board" | "tray";
  cellSize?: number; // For responsive board letters
}

export const Letter: React.FC<LetterProps> = ({ letter, onClick, disabled = false, isSelected = false, isHighlighted = false, isTemporary = false, variant = "board", cellSize }) => {
  const getClasses = () => {
    const baseClasses = "flex flex-col items-center justify-center font-bold relative transition-all duration-200";

    if (variant === "board") {
      const colorClasses = letter ? (isTemporary ? "bg-yellow-200 text-yellow-800" : "bg-yellow-100 text-yellow-800") : isSelected ? "bg-blue-100" : isHighlighted ? "bg-gray-200" : "bg-gray-50 hover:bg-gray-100";

      return `${baseClasses} rounded ${colorClasses} ${onClick ? "cursor-pointer" : ""}`;
    } else {
      // tray variant
      const sizeClasses = "w-12 h-12 text-lg rounded-lg";
      const colorClasses = letter ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:scale-105 cursor-pointer shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed";

      return `${baseClasses} ${sizeClasses} ${colorClasses}`;
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
    }
    return {};
  };

  const isDisabled = disabled || (variant === "tray" && !letter);

  return (
    <button onClick={onClick} disabled={isDisabled} className={getClasses()} style={getStyle()}>
      {letter && (
        <>
          <span>{letter.letter}</span>
          <span
            className="absolute bottom-0 right-1"
            style={{
              fontSize: variant === "board" && cellSize ? `${Math.max(cellSize * 0.2, 8)}px` : "0.75rem",
            }}
          >
            {letter.points}
          </span>
        </>
      )}
    </button>
  );
};
