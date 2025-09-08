import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import "./index.css";
import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
import { WebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";

const repo = new Repo({
  network: [new WebSocketClientAdapter("wss://sync3.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
});

const docUrl = `${document.location.hash.substring(1)}`;
let handle;
if (isValidAutomergeUrl(docUrl)) {
  handle = await repo.find(docUrl);
} else {
  handle = repo.create<{ count: number }>({ count: 0 });
}

(window as any).handle = handle; // we'll use this later for experimentation
(window as any).repo = repo;

console.log(handle.doc());
