import type { ClinicalAssessment } from "./types";

const DEFAULT_DISCLAIMER =
  "EDUCATIONAL SIMULATION ONLY — NOT MEDICAL ADVICE. Fictional cases for learning. Not Health Canada approved. Do not use for real patients. Output may be wrong.";

export function parseAssessment(raw: string): ClinicalAssessment {
  const trimmed = raw.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Model did not return valid JSON");
  }
  const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as ClinicalAssessment;
  if (!parsed.disclaimer) {
    parsed.disclaimer = DEFAULT_DISCLAIMER;
  }
  if (!Array.isArray(parsed.differentials)) {
    parsed.differentials = [];
  }
  if (!Array.isArray(parsed.redFlags)) {
    parsed.redFlags = [];
  }
  return parsed;
}

export function fallbackAssessment(message: string): ClinicalAssessment {
  return {
    summary:
      "Unable to generate an AI assessment. Please check API configuration or try again.",
    redFlags: [],
    differentials: [],
    missingInformation: ["Complete case data", "API connectivity"],
    questionsToAsk: [],
    disclaimer: `${DEFAULT_DISCLAIMER} Error: ${message}`,
  };
}
