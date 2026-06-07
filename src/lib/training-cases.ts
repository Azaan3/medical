import type { ClinicalCase } from "./types";

type TrainingCaseSeed = Omit<ClinicalCase, "id" | "createdAt">;

const seeds: { label: string; case: TrainingCaseSeed }[] = [
  {
    label: "Chest pain — 58M",
    case: {
      demographics: { ageYears: 58, sex: "male", region: "Canada" },
      chiefComplaint: "Crushing chest pain",
      symptoms: ["diaphoresis", "nausea", "left arm heaviness"],
      history:
        "Pain started 45 min ago at rest. Hypertension, smokes 20 pack-years. No prior MI.",
      medications: ["amlodipine 5 mg daily"],
      allergies: ["NKDA"],
      vitals: {
        heartRate: 98,
        bloodPressureSystolic: 158,
        bloodPressureDiastolic: 92,
        oxygenSaturation: 96,
        respiratoryRate: 18,
      },
      labs: [
        { name: "troponin", value: "pending", unit: "ng/L" },
      ],
      narrative:
        "Trainee case A. ED triage. Appears uncomfortable. Lungs clear. No leg swelling.",
      uploadedFileNames: [],
      documentTexts: [],
    },
  },
  {
    label: "Fever & RLQ pain — 22F",
    case: {
      demographics: { ageYears: 22, sex: "female", region: "Canada", pregnancyStatus: "unknown" },
      chiefComplaint: "Abdominal pain and fever",
      symptoms: ["fever", "anorexia", "nausea", "RLQ tenderness"],
      history:
        "Pain migrated from periumbilical to RLQ over 12 hours. LMP 3 weeks ago (irregular cycles).",
      medications: [],
      allergies: [],
      vitals: {
        temperatureC: 38.4,
        heartRate: 110,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 72,
        respiratoryRate: 16,
      },
      labs: [
        { name: "WBC", value: "14.2", unit: "x10^9/L", flag: "high" },
        { name: "urine hCG", value: "pending" },
      ],
      narrative: "Trainee case B. Guarding at McBurney point. Rovsing positive.",
      uploadedFileNames: [],
      documentTexts: [],
    },
  },
  {
    label: "Thunderclap headache — 34F",
    case: {
      demographics: { ageYears: 34, sex: "female", region: "Canada" },
      chiefComplaint: "Worst headache of life",
      symptoms: ["sudden severe headache", "neck stiffness", "photophobia"],
      history: "Maximal intensity within seconds. No trauma. On OCP. No prior migraines.",
      medications: ["combined oral contraceptive"],
      allergies: [],
      vitals: {
        heartRate: 88,
        bloodPressureSystolic: 172,
        bloodPressureDiastolic: 98,
        oxygenSaturation: 99,
      },
      labs: [],
      narrative:
        "Trainee case C. GCS 15. No focal deficit on brief exam. Fundoscopy not yet done.",
      uploadedFileNames: [],
      documentTexts: [],
    },
  },
];

export function listTrainingCases(): { id: string; label: string }[] {
  return seeds.map((s, i) => ({ id: String(i), label: s.label }));
}

export function loadTrainingCase(id: string): ClinicalCase | null {
  const seed = seeds[Number(id)];
  if (!seed) return null;
  return {
    ...seed.case,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
