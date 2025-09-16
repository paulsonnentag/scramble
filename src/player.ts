// Player ID management
export const getPlayerId = (): string => {
  let playerId = localStorage.getItem("scramble:playerId");
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("scramble:playerId", playerId);
  }
  return playerId;
};

// Player name management
export const getPlayerName = (): string => {
  return localStorage.getItem("scramble:playerName") || "Anonymous";
};

export const setPlayerName = (name: string): void => {
  localStorage.setItem("scramble:playerName", name);
};
