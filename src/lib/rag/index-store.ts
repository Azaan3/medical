import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { KnowledgeIndex } from "./types";

const INDEX_PATH = join(process.cwd(), "data", "knowledge-index.json");

let cached: KnowledgeIndex | null = null;

export function loadKnowledgeIndex(): KnowledgeIndex {
  if (cached) return cached;

  if (!existsSync(INDEX_PATH)) {
    cached = {
      version: 1,
      builtAt: new Date(0).toISOString(),
      hasEmbeddings: false,
      chunks: [],
    };
    return cached;
  }

  const raw = readFileSync(INDEX_PATH, "utf-8");
  cached = JSON.parse(raw) as KnowledgeIndex;
  return cached;
}

export function getIndexPath(): string {
  return INDEX_PATH;
}
