import React from "react";
import type { Letter } from "../types";

interface LetterViewProps {
  letter: Letter;
  onClick?: () => void;
  disabled?: boolean;
}

export const LetterView: React.FC<LetterViewProps> = ({ letter, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white w-full h-full rounded-lg shadow-md"
    >
      <span>{letter.value}</span>
    </button>
  );
};
