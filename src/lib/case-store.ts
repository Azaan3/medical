import type { ClinicalCase } from "./types";

export function createEmptyCase(): ClinicalCase {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    demographics: { region: "Canada" },
    chiefComplaint: "",
    symptoms: [],
    history: "",
    medications: [],
    allergies: [],
    vitals: {},
    labs: [],
    narrative: "",
    uploadedFileNames: [],
    documentTexts: [],
  };
}
