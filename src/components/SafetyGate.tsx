"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_VERSION,
  REQUIRED_CONSENT_CHECKS,
  type UserConsent,
} from "@/lib/consent";
import { loadStoredConsent, storeConsent } from "@/lib/consent-client";

type CheckId = (typeof REQUIRED_CONSENT_CHECKS)[number]["id"];

export function SafetyGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [checks, setChecks] = useState<Record<CheckId, boolean>>({
    educationalOnly: false,
    fictionalCasesOnly: false,
    notMedicalAdvice: false,
    noRealPatients: false,
    parentalPermission: false,
    age13OrWithGuardian: false,
  });

  useEffect(() => {
    const stored = loadStoredConsent();
    if (stored?.version === CONSENT_VERSION) {
      setAccepted(true);
    }
    setReady(true);
  }, []);

  const allChecked = REQUIRED_CONSENT_CHECKS.every((c) => checks[c.id]);

  function accept() {
    const consent: UserConsent = {
      version: CONSENT_VERSION,
      educationalOnly: true,
      fictionalCasesOnly: true,
      notMedicalAdvice: true,
      noRealPatients: true,
      parentalPermission: true,
      age13OrWithGuardian: true,
    };
    storeConsent(consent);
    setAccepted(true);
  }

  if (!ready) return null;

  if (!accepted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 overflow-y-auto">
        <div
          role="dialog"
          aria-labelledby="safety-title"
          className="my-4 max-w-lg rounded-xl bg-white p-6 shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
            Educational simulator — not medical care
          </p>
          <h2 id="safety-title" className="mt-1 text-xl font-bold text-clinical-900">
            Safety agreement (required)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This app is for learning only (e.g. school projects, practising fake
            cases). It is <strong>not</strong> approved by Health Canada and{" "}
            <strong>cannot</strong> replace a doctor.
          </p>

          <ul className="mt-4 space-y-3">
            {REQUIRED_CONSENT_CHECKS.map((item) => (
              <li key={item.id}>
                <label className="flex gap-2 text-sm text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checks[item.id]}
                    onChange={(e) =>
                      setChecks((prev) => ({
                        ...prev,
                        [item.id]: e.target.checked,
                      }))
                    }
                    className="mt-0.5 shrink-0"
                  />
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-slate-500">
            <Link href="/terms" className="underline text-clinical-700">
              Read full terms
            </Link>
            . Nothing here is legal advice. A parent/guardian should supervise
            accounts and deployment.
          </p>

          <button
            type="button"
            disabled={!allChecked}
            onClick={accept}
            className="mt-5 w-full rounded-lg bg-clinical-700 py-2.5 text-sm font-medium text-white hover:bg-clinical-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            I agree — educational use only
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
