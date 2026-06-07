const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;

export interface TextChunk {
  id: string;
  source: string;
  text: string;
}

export function chunkText(source: string, fullText: string): TextChunk[] {
  const normalized = fullText.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;

  while (start < normalized.length) {
    let end = Math.min(start + CHUNK_SIZE, normalized.length);
    if (end < normalized.length) {
      const breakAt = normalized.lastIndexOf("\n\n", end);
      if (breakAt > start + CHUNK_SIZE / 2) end = breakAt;
    }

    const slice = normalized.slice(start, end).trim();
    if (slice.length > 40) {
      chunks.push({
        id: `${source}#${index}`,
        source,
        text: slice,
      });
      index += 1;
    }

    if (end >= normalized.length) break;
    start = Math.max(start + 1, end - CHUNK_OVERLAP);
  }

  return chunks;
}
