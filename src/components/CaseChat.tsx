"use client";

import { useState } from "react";
import { APP_MODE } from "@/lib/config";
import { CONSENT_BLOCK_MESSAGE } from "@/lib/consent";
import { loadStoredConsent } from "@/lib/consent-client";
import { PHI_BLOCK_MESSAGE, scanClinicalCaseForPhi } from "@/lib/phi-guard";
import type { ChatMessage, ClinicalAssessment, ClinicalCase } from "@/lib/types";

interface Props {
  clinicalCase: ClinicalCase;
  onSymptomsAppend: (symptoms: string[]) => void;
  onAssessment: (
    assessment: ClinicalAssessment,
    sourcesUsed?: string[],
  ) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function CaseChat({
  clinicalCase,
  onSymptomsAppend,
  onAssessment,
  onLoadingChange,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    onLoadingChange?.(true);
    setError(null);

    if (APP_MODE === "training") {
      const phiHits = scanClinicalCaseForPhi({
        chiefComplaint: clinicalCase.chiefComplaint,
        symptoms: clinicalCase.symptoms,
        history: clinicalCase.history,
        narrative: clinicalCase.narrative,
        documentTexts: clinicalCase.documentTexts,
        newInput: text,
      });
      if (phiHits.length > 0) {
        setError(`${PHI_BLOCK_MESSAGE} (${phiHits.join(", ")})`);
        setLoading(false);
        onLoadingChange?.(false);
        return;
      }
    }

    const symptomLike = text
      .split(/[,;.]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 80);
    if (symptomLike.length <= 5) {
      onSymptomsAppend(symptomLike);
    }

    const consent = loadStoredConsent();
    if (!consent) {
      setError(CONSENT_BLOCK_MESSAGE);
      setLoading(false);
      onLoadingChange?.(false);
      return;
    }

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicalCase,
          messages: [...messages, userMsg],
          newInput: text,
          consent,
        }),
      });
      const data = (await res.json()) as {
        assessment: ClinicalAssessment;
        sourcesUsed?: string[];
        error?: string;
      };
      onAssessment(data.assessment, data.sourcesUsed);
      if (data.error) setError(data.error);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.assessment.summary,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <div className="clinical-panel flex flex-col h-full min-h-[320px]">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="font-semibold text-clinical-900">Collaborative diagnosis</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Add new symptoms or findings as they emerge. The assessment updates each
          turn.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 italic">
            Example: &quot;Added fever 39°C for 2 days and right lower quadrant
            tenderness&quot;
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm rounded-lg px-3 py-2 max-w-[95%] ${
              m.role === "user"
                ? "ml-auto bg-clinical-100 text-clinical-900"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {error && (
        <p className="px-4 text-xs text-red-700 bg-red-50 py-2">{error}</p>
      )}

      <form onSubmit={submit} className="border-t border-slate-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New symptom, lab result, or clinical question…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-clinical-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-clinical-900"
        >
          {loading ? "…" : "Update"}
        </button>
      </form>
    </div>
  );
}
