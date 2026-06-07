"use client";

import { useState } from "react";
import type { CaseDocument, ClinicalCase, LabResult } from "@/lib/types";

interface Props {
  clinicalCase: ClinicalCase;
  onChange: (next: ClinicalCase) => void;
}

function parseList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CaseForm({ clinicalCase, onChange }: Props) {
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const update = (partial: Partial<ClinicalCase>) =>
    onChange({ ...clinicalCase, ...partial });

  const updateDemo = (field: string, value: string | number) =>
    onChange({
      ...clinicalCase,
      demographics: { ...clinicalCase.demographics, [field]: value },
    });

  const updateVitals = (field: string, value: number | undefined) =>
    onChange({
      ...clinicalCase,
      vitals: { ...clinicalCase.vitals, [field]: value },
    });

  const addLab = () => {
    const labs: LabResult[] = [
      ...clinicalCase.labs,
      { name: "", value: "", unit: "" },
    ];
    update({ labs });
  };

  return (
    <div className="clinical-panel p-5 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
      <h2 className="text-lg font-semibold text-clinical-900">Training case</h2>
      <p className="text-xs text-slate-600 -mt-3">
        Use fictional patients only (e.g. &quot;58M with chest pain&quot;). No real
        names or health card numbers.
      </p>

      <fieldset className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col gap-1">
          Age (years)
          <input
            type="number"
            className="rounded-md border border-slate-300 px-2 py-1.5"
            value={clinicalCase.demographics.ageYears ?? ""}
            onChange={(e) => {
              const age = e.target.value ? Number(e.target.value) : undefined;
              onChange({
                ...clinicalCase,
                demographics: {
                  ...clinicalCase.demographics,
                  ageYears: age,
                },
              });
            }}
          />
        </label>
        <label className="flex flex-col gap-1">
          Sex
          <select
            className="rounded-md border border-slate-300 px-2 py-1.5"
            value={clinicalCase.demographics.sex ?? ""}
            onChange={(e) => updateDemo("sex", e.target.value)}
          >
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 col-span-2">
          Region / country (guideline context)
          <input
            type="text"
            placeholder="e.g. UK, India, Brazil"
            className="rounded-md border border-slate-300 px-2 py-1.5"
            value={clinicalCase.demographics.region ?? ""}
            onChange={(e) => updateDemo("region", e.target.value)}
          />
        </label>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm">
        Chief complaint
        <input
          type="text"
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.chiefComplaint}
          onChange={(e) => update({ chiefComplaint: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Symptoms (comma-separated; add more in chat as they emerge)
        <textarea
          rows={2}
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.symptoms.join(", ")}
          onChange={(e) => update({ symptoms: parseList(e.target.value) })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        History & exam findings
        <textarea
          rows={3}
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.history}
          onChange={(e) => update({ history: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Free-text narrative
        <textarea
          rows={3}
          placeholder="Full case description, timeline, context…"
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.narrative}
          onChange={(e) => update({ narrative: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Medications (comma-separated)
        <input
          type="text"
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.medications.join(", ")}
          onChange={(e) => update({ medications: parseList(e.target.value) })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Allergies
        <input
          type="text"
          className="rounded-md border border-slate-300 px-2 py-1.5"
          value={clinicalCase.allergies.join(", ")}
          onChange={(e) => update({ allergies: parseList(e.target.value) })}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-slate-800 mb-2">Vitals</legend>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(
            [
              ["temperatureC", "Temp °C"],
              ["heartRate", "HR"],
              ["respiratoryRate", "RR"],
              ["bloodPressureSystolic", "BP sys"],
              ["bloodPressureDiastolic", "BP dia"],
              ["oxygenSaturation", "SpO₂ %"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-0.5">
              {label}
              <input
                type="number"
                className="rounded-md border border-slate-300 px-2 py-1"
                value={clinicalCase.vitals[key] ?? ""}
                onChange={(e) =>
                  updateVitals(
                    key,
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-800">Labs</span>
          <button
            type="button"
            onClick={addLab}
            className="text-xs text-clinical-700 hover:underline"
          >
            + Add lab
          </button>
        </div>
        {clinicalCase.labs.map((lab, i) => (
          <div key={i} className="grid grid-cols-3 gap-1 mb-2 text-sm">
            <input
              placeholder="Name"
              className="rounded border border-slate-300 px-2 py-1"
              value={lab.name}
              onChange={(e) => {
                const labs = [...clinicalCase.labs];
                labs[i] = { ...lab, name: e.target.value };
                update({ labs });
              }}
            />
            <input
              placeholder="Value"
              className="rounded border border-slate-300 px-2 py-1"
              value={lab.value}
              onChange={(e) => {
                const labs = [...clinicalCase.labs];
                labs[i] = { ...lab, value: e.target.value };
                update({ labs });
              }}
            />
            <input
              placeholder="Unit"
              className="rounded border border-slate-300 px-2 py-1"
              value={lab.unit ?? ""}
              onChange={(e) => {
                const labs = [...clinicalCase.labs];
                labs[i] = { ...lab, unit: e.target.value };
                update({ labs });
              }}
            />
          </div>
        ))}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Attach reports (PDF, images, text — extracted into case)
        <input
          type="file"
          multiple
          accept=".pdf,image/*,.txt,.md"
          className="text-xs"
          disabled={extracting}
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length === 0) return;
            setExtracting(true);
            setExtractError(null);
            const newDocs: CaseDocument[] = [...clinicalCase.documentTexts];
            const names = [...clinicalCase.uploadedFileNames];

            for (const file of files) {
              const form = new FormData();
              form.append("file", file);
              try {
                const res = await fetch("/api/extract", {
                  method: "POST",
                  body: form,
                });
                const data = (await res.json()) as {
                  name?: string;
                  text?: string;
                  error?: string;
                };
                if (!res.ok || data.error) {
                  throw new Error(data.error ?? `Failed: ${file.name}`);
                }
                newDocs.push({ name: data.name ?? file.name, text: data.text ?? "" });
                names.push(file.name);
              } catch (err) {
                setExtractError(
                  err instanceof Error ? err.message : "Upload failed",
                );
              }
            }

            update({
              documentTexts: newDocs,
              uploadedFileNames: [...new Set(names)],
            });
            setExtracting(false);
            e.target.value = "";
          }}
        />
        {extracting && (
          <span className="text-xs text-clinical-700">Extracting text…</span>
        )}
        {extractError && (
          <span className="text-xs text-red-700">{extractError}</span>
        )}
        {clinicalCase.documentTexts.length > 0 && (
          <ul className="text-xs text-slate-600 mt-1 space-y-1">
            {clinicalCase.documentTexts.map((d) => (
              <li key={d.name}>
                <span className="font-medium">{d.name}</span>
                <span className="text-slate-400">
                  {" "}
                  — {d.text.length.toLocaleString()} chars extracted
                </span>
              </li>
            ))}
          </ul>
        )}
      </label>
    </div>
  );
}
