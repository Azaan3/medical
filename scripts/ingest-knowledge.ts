/**
 * Builds data/knowledge-index.json from knowledge/ folder.
 * Run: npm run ingest
 * With OPENAI_API_KEY: also computes semantic embeddings.
 */
import { buildKnowledgeIndex } from "../src/lib/rag/ingest";

async function main() {
  const withEmbeddings = Boolean(process.env.OPENAI_API_KEY);
  console.log(
    `Ingesting knowledge (embeddings: ${withEmbeddings ? "yes" : "keyword-only"})…`,
  );
  const index = await buildKnowledgeIndex({ withEmbeddings });
  console.log(
    `Done. ${index.chunks.length} chunks → data/ and src/data/knowledge-index.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
