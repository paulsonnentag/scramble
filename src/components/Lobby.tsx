import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { loadLanguage } from "../languages";
import { fillTray } from "../letters";
import { TRAY_SIZE } from "../config";
import type { GameState } from "../types";
import { Button } from "./Button";
import { getPlayerName, setPlayerName } from "../player";

type LobbyProps = {
  docUrl: AutomergeUrl;
  playerId: string;
};

export const Lobby: React.FC<LobbyProps> = ({ docUrl, playerId }) => {
  const [doc, changeDoc] = useDocument<GameState>(docUrl);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const player = doc?.players[playerId];
  const isReady = player?.isReady || false;
  const canChangeLanguage = !isReady;

  // Initialize player if not exists
  useEffect(() => {
    if (doc && doc.language && !doc.players[playerId]) {
      // Load language and generate letters for new player
      loadLanguage(doc.language as "en" | "de").then((language) => {
        if (language) {
          changeDoc((doc) => {
            if (!doc.players[playerId]) {
              const tray = new Array(TRAY_SIZE).fill(null);
              fillTray(tray, language);

              doc.players[playerId] = {
                name: getPlayerName(),
                points: 0,
                letters: tray,
                isReady: false,
              };
            }
          });
        }
      });
    }
  }, [doc, playerId, changeDoc]);

  const changeLanguage = useCallback(
    (language: string) => {
      if (!canChangeLanguage) return;

      setSelectedLanguage(language);
      changeDoc((draft) => {
        draft.language = language;
      });
    },
    [canChangeLanguage, changeDoc]
  );

  const handleReadyToggle = useCallback(() => {
    changeDoc((doc) => {
      const currentPlayer = doc.players[playerId];
      if (currentPlayer) {
        currentPlayer.isReady = !currentPlayer.isReady;
      }
    });
  }, [changeDoc, playerId]);

  const playerName = doc?.players[playerId]?.name || getPlayerName();
  const changeName = (newName: string) => {
    changeDoc((doc) => {
      const currentPlayer = doc.players[playerId];
      if (currentPlayer) {
        currentPlayer.name = newName;
        setPlayerName(newName);
      }
    });
  };

  // Check if all players are ready
  const allPlayersReady = doc?.players
    ? Object.values(doc.players).length > 0 &&
      Object.values(doc.players).every((p) => p.isReady)
    : false;

  if (!doc) {
    return <div className="p-4">Loading...</div>;
  }

  const players = Object.entries(doc.players || {});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Player Name Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Name</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => changeName(e.target.value)}
            placeholder="Enter your name"
            disabled={isReady}
            className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Language</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => changeLanguage("en")}
              variant={selectedLanguage === "en" ? "positive" : "neutral"}
              disabled={!canChangeLanguage}
            >
              🇺🇸 English
            </Button>
            <Button
              onClick={() => changeLanguage("de")}
              variant={selectedLanguage === "de" ? "positive" : "neutral"}
              disabled={!canChangeLanguage}
            >
              🇩🇪 German
            </Button>
          </div>
          {!canChangeLanguage && (
            <p className="text-sm text-gray-500 mt-2">
              Cannot change language after pressing ready
            </p>
          )}
        </div>

        {/* Ready Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Button
            onClick={handleReadyToggle}
            variant={isReady ? "negative" : "positive"}
            disabled={!playerName.trim()}
          >
            {isReady ? "Not Ready" : "Ready to Play"}
          </Button>
          {!playerName.trim() && (
            <p className="text-sm text-red-500 mt-2">
              Please enter your name first
            </p>
          )}
        </div>

        {/* Players List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Players ({players.length})
          </h2>
          {players.length === 0 ? (
            <p className="text-gray-500">No players yet...</p>
          ) : (
            <div className="space-y-2">
              {players.map(([id, player]) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="font-medium">
                    {id === playerId
                      ? `${player.name} (You)`
                      : `${player.name}`}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      player.isReady
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {player.isReady ? "Ready" : "Not Ready"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {allPlayersReady && players.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium text-center">
                All players ready! Starting game...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
