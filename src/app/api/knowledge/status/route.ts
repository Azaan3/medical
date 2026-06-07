import { NextResponse } from "next/server";
import { loadKnowledgeIndex } from "@/lib/rag/index-store";

export async function GET() {
  const index = loadKnowledgeIndex();
  const sources = [...new Set(index.chunks.map((c) => c.source))];

  return NextResponse.json({
    chunkCount: index.chunks.length,
    sourceCount: sources.length,
    sources,
    hasEmbeddings: index.hasEmbeddings,
    builtAt: index.builtAt,
  });
}
