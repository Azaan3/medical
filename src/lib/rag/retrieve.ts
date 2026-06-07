import type { ClinicalCase } from "../types";
import { createEmbedding } from "../openai";
import { loadKnowledgeIndex } from "./index-store";
import { searchKnowledge } from "./search";
import type { KnowledgeChunk } from "./types";

export function buildRetrievalQuery(
  clinicalCase: ClinicalCase,
  newInput: string,
): string {
  return [
    clinicalCase.chiefComplaint,
    ...clinicalCase.symptoms,
    clinicalCase.history,
    clinicalCase.narrative,
    newInput,
    clinicalCase.documentTexts?.map((d) => d.text).join("\n") ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function retrieveGuidelineContext(
  clinicalCase: ClinicalCase,
  newInput: string,
): Promise<{ chunks: KnowledgeChunk[]; contextBlock: string }> {
  const index = loadKnowledgeIndex();
  const query = buildRetrievalQuery(clinicalCase, newInput);

  let queryEmbedding: number[] | null = null;
  if (index.hasEmbeddings && process.env.OPENAI_API_KEY) {
    try {
      queryEmbedding = await createEmbedding(query);
    } catch {
      queryEmbedding = null;
    }
  }

  const chunks = searchKnowledge(index, query, queryEmbedding, 6);

  if (chunks.length === 0) {
    return { chunks: [], contextBlock: "" };
  }

  const contextBlock = chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.source}]\n${c.text}`,
    )
    .join("\n\n---\n\n");

  return { chunks, contextBlock };
}
