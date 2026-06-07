import type { KnowledgeChunk, KnowledgeIndex } from "./types";

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2),
  );
}

function keywordScore(queryTokens: Set<string>, chunkText: string): number {
  const chunkTokens = tokenize(chunkText);
  let hits = 0;
  for (const t of queryTokens) {
    if (chunkTokens.has(t)) hits += 1;
  }
  return hits / Math.max(queryTokens.size, 1);
}

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export function searchKnowledge(
  index: KnowledgeIndex,
  query: string,
  queryEmbedding: number[] | null,
  topK = 6,
): KnowledgeChunk[] {
  if (index.chunks.length === 0) return [];

  const queryTokens = tokenize(query);
  const scored = index.chunks.map((chunk) => {
    const kw = keywordScore(queryTokens, chunk.text);
    const sem =
      queryEmbedding && chunk.embedding
        ? cosine(queryEmbedding, chunk.embedding)
        : 0;
    const hasSemantic = index.hasEmbeddings && queryEmbedding && chunk.embedding;
    const score = hasSemantic ? sem * 0.7 + kw * 0.3 : kw;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}
