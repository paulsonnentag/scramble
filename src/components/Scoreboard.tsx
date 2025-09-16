import React from "react";
import type { GameState } from "../types";

type ScoreboardProps = {
  gameState: GameState;
  currentPlayerId: string;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  gameState,
  currentPlayerId,
}) => {
  // Sort players by score (descending)
  const sortedPlayers = Object.entries(gameState.players || {})
    .sort(([, a], [, b]) => b.points - a.points)
    .map(([playerId, player], index) => ({
      playerId,
      player,
      rank: index + 1,
    }));

  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-4xl">
      <div className="flex gap-4 justify-center">
        {sortedPlayers.map(({ playerId, player, rank }) => (
          <div
            key={playerId}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              playerId === currentPlayerId
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50"
            }`}
          >
            <span className="text-xs font-medium text-gray-600">#{rank}</span>
            <span className="font-medium text-sm">{player.name}</span>
            <span className="font-bold text-blue-600">{player.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
