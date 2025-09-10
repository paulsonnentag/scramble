import React from "react";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { isValidAutomergeUrl, Repo, type AutomergeUrl } from "@automerge/automerge-repo";
import { WebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { createRoot } from "react-dom/client";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import "./index.css";
import { App } from "./components/App";
import type { GameState } from "./types";
import { createInitialGameState } from "./letters";
import { WEBSOCKET_URL } from "./config";

const repo = new Repo({
  network: [new WebSocketClientAdapter(WEBSOCKET_URL)],
  storage: new IndexedDBStorageAdapter(),
});

const docUrl = `${document.location.hash.substring(1)}` as AutomergeUrl;
let handle;
if (isValidAutomergeUrl(docUrl)) {
  handle = await repo.find(docUrl);
} else {
  handle = repo.create<GameState>(createInitialGameState());
  document.location.hash = handle.url;
}

(window as any).handle = handle; // we'll use this later for experimentation
(window as any).repo = repo;

console.log(handle.doc());

createRoot(document.getElementById("root") as HTMLElement).render(
  <RepoContext.Provider value={repo}>
    <React.StrictMode>
      <App url={docUrl} />
    </React.StrictMode>
  </RepoContext.Provider>
);
