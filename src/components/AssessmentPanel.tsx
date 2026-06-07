import type { ClinicalAssessment } from "@/lib/types";

const likelihoodStyles = {
  high: "bg-red-100 text-red-900 border-red-200",
  moderate: "bg-amber-100 text-amber-900 border-amber-200",
  low: "bg-slate-100 text-slate-800 border-slate-200",
};

const urgencyStyles = {
  immediate: "text-alert-critical font-semibold",
  urgent: "text-alert-warning font-medium",
  monitor: "text-slate-700",
};

interface Props {
  assessment: ClinicalAssessment | null;
  loading: boolean;
  sourcesUsed?: string[];
}

export function AssessmentPanel({ assessment, loading, sourcesUsed }: Props) {
  if (loading) {
    return (
      <div className="clinical-panel p-6 animate-pulse">
        <p className="text-slate-600">Analyzing case…</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="clinical-panel p-6 text-slate-600">
        Enter case details and collaborate with the AI to see ranked
        differentials, red flags, and suggested workup.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="clinical-panel p-5">
        <h2 className="text-lg font-semibold text-clinical-900">Summary</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{assessment.summary}</p>
      </section>

      {assessment.redFlags.length > 0 && (
        <section className="clinical-panel border-red-200 p-5">
          <h2 className="text-lg font-semibold text-alert-critical">Red flags</h2>
          <ul className="mt-3 space-y-3">
            {assessment.redFlags.map((rf, i) => (
              <li key={i} className="border-l-4 border-red-400 pl-3">
                <p className={urgencyStyles[rf.urgency]}>{rf.finding}</p>
                <p className="text-sm text-slate-600 mt-1">{rf.action}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="clinical-panel p-5">
        <h2 className="text-lg font-semibold text-clinical-900">
          Differential diagnoses
        </h2>
        <div className="mt-4 space-y-4">
          {assessment.differentials.map((dx, i) => (
            <article
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{dx.condition}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${likelihoodStyles[dx.likelihood]}`}
                >
                  {dx.likelihood}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{dx.rationale}</p>
              {dx.supportingFindings.length > 0 && (
                <p className="mt-2 text-xs text-slate-600">
                  <span className="font-medium">For:</span>{" "}
                  {dx.supportingFindings.join("; ")}
                </p>
              )}
              {dx.againstFindings.length > 0 && (
                <p className="mt-1 text-xs text-slate-600">
                  <span className="font-medium">Against:</span>{" "}
                  {dx.againstFindings.join("; ")}
                </p>
              )}
              {dx.suggestedWorkup.length > 0 && (
                <p className="mt-2 text-xs text-clinical-700">
                  <span className="font-medium">Suggested workup:</span>{" "}
                  {dx.suggestedWorkup.join("; ")}
                </p>
              )}
              {dx.citations.length > 0 && (
                <p className="mt-2 text-xs italic text-slate-500">
                  {dx.citations.join(" · ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {(assessment.missingInformation.length > 0 ||
        assessment.questionsToAsk.length > 0) && (
        <section className="clinical-panel p-5">
          <h2 className="text-lg font-semibold text-clinical-900">Gaps & questions</h2>
          {assessment.missingInformation.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {assessment.missingInformation.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {assessment.questionsToAsk.length > 0 && (
            <>
              <p className="mt-3 text-sm font-medium text-slate-800">
                Questions to ask the patient:
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {assessment.questionsToAsk.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {sourcesUsed && sourcesUsed.length > 0 && (
        <section className="clinical-panel p-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Guideline sources used
          </h2>
          <ul className="mt-2 text-xs text-slate-600 list-disc pl-4 space-y-0.5">
            {[...new Set(sourcesUsed)].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-slate-500 px-1">{assessment.disclaimer}</p>
    </div>
  );
}
