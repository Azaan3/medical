export interface KnowledgeChunk {
  id: string;
  source: string;
  text: string;
  embedding?: number[];
}

export interface KnowledgeIndex {
  version: number;
  builtAt: string;
  hasEmbeddings: boolean;
  chunks: KnowledgeChunk[];
}
