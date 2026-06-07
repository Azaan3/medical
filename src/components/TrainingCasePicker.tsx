"use client";

import { listTrainingCases, loadTrainingCase } from "@/lib/training-cases";
import type { ClinicalCase } from "@/lib/types";

interface Props {
  onLoad: (clinicalCase: ClinicalCase) => void;
}

export function TrainingCasePicker({ onLoad }: Props) {
  const cases = listTrainingCases();

  return (
    <div className="clinical-panel p-4 mb-4">
      <h2 className="text-sm font-semibold text-clinical-900">
        Start with a sample case
      </h2>
      <p className="text-xs text-slate-600 mt-1 mb-3">
        Fictional patients for practice. Click one, then hit Update in chat.
      </p>
      <div className="flex flex-wrap gap-2">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              const loaded = loadTrainingCase(c.id);
              if (loaded) onLoad(loaded);
            }}
            className="rounded-lg border border-clinical-100 bg-clinical-50 px-3 py-1.5 text-xs font-medium text-clinical-900 hover:bg-clinical-100"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
