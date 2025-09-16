import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useEffect, useState } from "react";
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

  // Load language when doc changes
  useEffect(() => {
    if (doc?.language && !language) {
      loadLanguage(doc.language as any).then(setLanguage);
    }
  }, [doc?.language, language]);

  if (!language) return <div>Loading language...</div>;

  const player = doc.players[playerId];
  if (!player) return <div>Player not found</div>;

  const hasTemporaryPlacements = !!player.temporaryPlacement;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-300">
      <div className="flex-1"></div>

      <div style={BORD_SIZE}>
        <GameBoard
          board={doc.board}
          temporaryPlacement={player.temporaryPlacement}
          onCellSelect={() => {}}
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
