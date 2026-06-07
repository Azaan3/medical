import { NextResponse } from "next/server";
import { buildKnowledgeIndex } from "@/lib/rag/ingest";
import { loadKnowledgeIndex } from "@/lib/rag/index-store";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const withEmbeddings = Boolean(process.env.OPENAI_API_KEY);
    const index = await buildKnowledgeIndex({ withEmbeddings });
    return NextResponse.json({
      ok: true,
      chunkCount: index.chunks.length,
      hasEmbeddings: index.hasEmbeddings,
      builtAt: index.builtAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reindex failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const index = loadKnowledgeIndex();
  return NextResponse.json({
    message:
      "POST to reindex after adding files to knowledge/. Set ADMIN_SECRET to protect in production.",
    chunkCount: index.chunks.length,
  });
}
