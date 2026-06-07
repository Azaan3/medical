"use client";

import { useState } from "react";
import { AssessmentPanel } from "@/components/AssessmentPanel";
import { CaseChat } from "@/components/CaseChat";
import { CaseForm } from "@/components/CaseForm";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { KnowledgeStatus } from "@/components/KnowledgeStatus";
import { createEmptyCase } from "@/lib/case-store";
import type { ClinicalAssessment, ClinicalCase } from "@/lib/types";

export default function Home() {
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase>(createEmptyCase);
  const [assessment, setAssessment] = useState<ClinicalAssessment | null>(null);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  function appendSymptoms(newOnes: string[]) {
    if (newOnes.length === 0) return;
    setClinicalCase((prev) => ({
      ...prev,
      symptoms: [...new Set([...prev.symptoms, ...newOnes])],
    }));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DisclaimerBanner />

      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-clinical-900">Clinical Copilot</h1>
            <p className="text-sm text-slate-600">
              Global physician decision support — iterative differentials & red flags
            </p>
            <KnowledgeStatus />
          </div>
          <button
            type="button"
            onClick={() => {
              setClinicalCase(createEmptyCase());
              setAssessment(null);
              setSourcesUsed([]);
            }}
            className="text-sm text-slate-600 hover:text-clinical-700 underline"
          >
            New case
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <CaseForm clinicalCase={clinicalCase} onChange={setClinicalCase} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <CaseChat
            clinicalCase={clinicalCase}
            onSymptomsAppend={appendSymptoms}
            onLoadingChange={setChatLoading}
            onAssessment={(a, sources) => {
              setAssessment(a);
              if (sources) setSourcesUsed(sources);
            }}
          />
          <AssessmentPanel
            assessment={assessment}
            loading={chatLoading}
            sourcesUsed={sourcesUsed}
          />
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Add your hospital PDFs to the <code className="text-slate-700">knowledge/</code> folder
        in the repo, redeploy, or POST /api/knowledge/reindex after upload.
      </footer>
    </div>
  );
}
