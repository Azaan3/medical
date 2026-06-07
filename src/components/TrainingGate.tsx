"use client";

import { useEffect, useState } from "react";
import { TRAINING_ACK_KEY } from "@/lib/config";

export function TrainingGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(sessionStorage.getItem(TRAINING_ACK_KEY) === "1");
  }, []);

  if (accepted === null) return null;

  if (!accepted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
        <div
          role="dialog"
          aria-labelledby="training-title"
          className="max-w-lg rounded-xl bg-white p-6 shadow-xl"
        >
          <h2 id="training-title" className="text-xl font-bold text-clinical-900">
            Training & simulation mode (Canada)
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>
              For <strong>medical students and trainees</strong> practising with{" "}
              <strong>fictional or fully de-identified</strong> cases.
            </li>
            <li>
              <strong>Not</strong> for real patient care. Not licensed by Health
              Canada as a medical device.
            </li>
            <li>
              Do not enter names, health card numbers, or other identifying
              information (PIPEDA / provincial health privacy laws).
            </li>
            <li>
              When you are licensed and this product is validated, a separate
              clinical mode may be offered under physician supervision.
            </li>
          </ul>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(TRAINING_ACK_KEY, "1");
              setAccepted(true);
            }}
            className="mt-6 w-full rounded-lg bg-clinical-700 py-2.5 text-sm font-medium text-white hover:bg-clinical-900"
          >
            I understand — training cases only
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
