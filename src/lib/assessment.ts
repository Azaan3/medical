import type { ClinicalAssessment } from "./types";

const DEFAULT_DISCLAIMER =
  "Clinical decision support only. The treating physician is solely responsible for diagnosis and treatment. Verify all suggestions against local guidelines and clinical judgment.";

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
