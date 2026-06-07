import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { chunkText } from "./chunker";
import type { KnowledgeChunk, KnowledgeIndex } from "./types";
import { createEmbedding } from "../openai";

const KNOWLEDGE_DIR = join(process.cwd(), "knowledge");
const INDEX_PATH = join(process.cwd(), "data", "knowledge-index.json");

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".csv",
  ".json",
]);

function walk(dir: string): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...walk(full));
    } else {
      const ext = entry.slice(entry.lastIndexOf(".")).toLowerCase();
      if (TEXT_EXTENSIONS.has(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

export function collectChunks(): KnowledgeChunk[] {
  const files = walk(KNOWLEDGE_DIR);
  const all: KnowledgeChunk[] = [];

  for (const filePath of files) {
    const source = relative(process.cwd(), filePath);
    const text = readFileSync(filePath, "utf-8");
    all.push(...chunkText(source, text));
  }

  return all;
}

export async function buildKnowledgeIndex(options: {
  withEmbeddings: boolean;
}): Promise<KnowledgeIndex> {
  const chunks = collectChunks();

  if (options.withEmbeddings) {
    for (let i = 0; i < chunks.length; i++) {
      chunks[i].embedding = await createEmbedding(chunks[i].text);
      if (i > 0 && i % 5 === 0) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  const index: KnowledgeIndex = {
    version: 1,
    builtAt: new Date().toISOString(),
    hasEmbeddings: options.withEmbeddings,
    chunks,
  };

  const srcDataPath = join(process.cwd(), "src", "data", "knowledge-index.json");
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
  const json = JSON.stringify(index);
  writeFileSync(INDEX_PATH, json);
  writeFileSync(srcDataPath, json);
  return index;
}
