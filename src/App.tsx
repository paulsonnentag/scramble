import type { AutomergeUrl } from "@automerge/automerge-repo";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import React from "react";

export const App = ({ url }: { url: AutomergeUrl }) => {
  const [doc] = useDocument(url, { suspense: true });

  return <div className="text-blue-500 p-5">{JSON.stringify(doc)}</div>;
};
