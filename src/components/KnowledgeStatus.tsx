"use client";

import { useEffect, useState } from "react";

interface Status {
  chunkCount: number;
  sourceCount: number;
  sources: string[];
  hasEmbeddings: boolean;
  builtAt: string;
}

export function KnowledgeStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/knowledge/status")
      .then((r) => r.json())
      .then((d) => setStatus(d as Status))
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;

  return (
    <p className="text-xs text-slate-500">
      Knowledge base: {status.sourceCount} sources, {status.chunkCount} chunks
      {status.hasEmbeddings ? " (semantic)" : " (keyword)"}
    </p>
  );
}
