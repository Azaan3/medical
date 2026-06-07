import type { ClinicalCase } from "./types";

export const SYSTEM_PROMPT = `You are Clinical Copilot — an EDUCATIONAL SIMULATOR for Canada. Users are students (including minors) practising with fictional cases only. This is NOT medical care and NOT medical advice.

STRICT RULES:
- Every response is for learning only. Never tell the user to diagnose, treat, or medicate a real person.
- Assume all cases are fictional simulations (Patient A, trainee cases).
- Reference Canadian clinical context when relevant (metric units, Canadian guideline names where known).
- If asked for real patient advice, refuse and remind them this is educational only.
- You do NOT provide definitive diagnoses or treatment orders. You offer ranked differential diagnoses, red-flag screening, and suggested workup for physician review.
- Always express uncertainty. Use likelihood bands: high, moderate, low — never percentages that imply false precision.
- Prioritize patient safety: list red flags and cannot-miss diagnoses first.
- When evidence is insufficient, say so and list what data would change the ranking.
- Cite sources when possible. When VERIFIED GUIDELINE EXCERPTS are provided, prioritize them and cite the [Source N: path] label in differentials.
- If excerpts conflict with general knowledge, prefer excerpts and note uncertainty.
- Adapt reasoning to patient demographics, region, and pregnancy status when provided.
- Never fabricate lab values, imaging findings, or literature.
- Output MUST be valid JSON matching the schema provided. No markdown outside JSON.`;

export function buildCaseContext(clinicalCase: ClinicalCase): string {
  return JSON.stringify(
    {
      demographics: clinicalCase.demographics,
      chiefComplaint: clinicalCase.chiefComplaint,
      symptoms: clinicalCase.symptoms,
      history: clinicalCase.history,
      medications: clinicalCase.medications,
      allergies: clinicalCase.allergies,
      vitals: clinicalCase.vitals,
      labs: clinicalCase.labs,
      narrative: clinicalCase.narrative,
      uploadedFiles: clinicalCase.uploadedFileNames,
      extractedDocuments: clinicalCase.documentTexts?.map((d) => ({
        name: d.name,
        excerpt: d.text.slice(0, 4000),
      })),
    },
    null,
    2,
  );
}

export const RESPONSE_SCHEMA = `{
  "summary": "string — 2-4 sentence clinical synthesis",
  "redFlags": [{ "finding": "string", "urgency": "immediate|urgent|monitor", "action": "string" }],
  "differentials": [{
    "condition": "string",
    "likelihood": "high|moderate|low",
    "rationale": "string",
    "supportingFindings": ["string"],
    "againstFindings": ["string"],
    "suggestedWorkup": ["string"],
    "citations": ["string"]
  }],
  "missingInformation": ["string"],
  "questionsToAsk": ["string"],
  "disclaimer": "string — remind physician this is CDS only"
}`;

export function buildUserPrompt(
  clinicalCase: ClinicalCase,
  conversationHistory: string,
  newInput: string,
  guidelineContext?: string,
): string {
  const guidelines = guidelineContext
    ? `\nVERIFIED GUIDELINE EXCERPTS (from uploaded knowledge base — cite these):\n${guidelineContext}\n`
    : "";

  return `CURRENT CASE:
${buildCaseContext(clinicalCase)}
${guidelines}
CONVERSATION (most recent context):
${conversationHistory || "(none)"}

PHYSICIAN INPUT (new symptoms, findings, or question):
${newInput}

Respond with updated assessment. Return JSON only:
${RESPONSE_SCHEMA}`;
}
