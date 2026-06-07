import bundledIndex from "../../../data/knowledge-index.json";
import type { KnowledgeIndex } from "./types";

const EMPTY_INDEX: KnowledgeIndex = {
  version: 1,
  builtAt: new Date(0).toISOString(),
  hasEmbeddings: false,
  chunks: [],
};

export function loadKnowledgeIndex(): KnowledgeIndex {
  const index = bundledIndex as KnowledgeIndex;
  if (!index?.chunks?.length) return EMPTY_INDEX;
  return index;
}

export function getIndexPath(): string {
  return "data/knowledge-index.json";
}
