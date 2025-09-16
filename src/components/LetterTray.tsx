import React, { useState, useEffect } from "react";
import type { Letter } from "../types";
import { LetterView } from "./Letter";
import { BOARD_HEIGHT, BOARD_WIDTH, TRAY_SIZE } from "../config";
import { CheckIcon, XIcon, DeleteIcon } from "lucide-react";
import { Button } from "./Button";

interface LetterTrayProps {
  letters: (Letter | null)[];
  onLetterClick: (letter: Letter) => void;
  canAccept: boolean;
  canReject: boolean;
  canBackspace: boolean;
  onAccept: () => void;
  onReject: () => void;
  onBackspace: () => void;
}

const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: `repeat(${TRAY_SIZE + 1}, 1fr)`,
  gridTemplateRows: `repeat(2, 1fr)`,
  gap: "4px",
  width: "100%",
  aspectRatio: `${TRAY_SIZE + 1}/2`,
  maxWidth: "500px",
  margin: "auto",
};

const REJECT_BUTTON_STYLE = {
  gridColumn: 1,
};

const ACCEPT_BUTTON_STYLE = {
  gridColumn: TRAY_SIZE + 1,
};

export const LetterTray: React.FC<LetterTrayProps> = ({
  letters,
  onLetterClick,
  canAccept,
  canReject,
  canBackspace,
  onAccept,
  onReject,
  onBackspace,
}) => {
  return (
    <div style={GRID_STYLE}>
      {letters.map((letter, index) => (
        <div key={letter?.id} style={{ gridColumn: index + 1 }}>
          {letter && (
            <LetterView letter={letter} onClick={() => onLetterClick(letter)} />
          )}
        </div>
      ))}

      <Button onClick={onBackspace}>
        <DeleteIcon />
      </Button>

      <Button variant="negative" onClick={onReject} style={REJECT_BUTTON_STYLE}>
        <XIcon />
      </Button>
      <Button variant="positive" onClick={onAccept} style={ACCEPT_BUTTON_STYLE}>
        <CheckIcon />
      </Button>
    </div>
  );
};
