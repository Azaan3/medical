const PHI_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "email address", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  {
    label: "phone number",
    regex: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  },
  {
    label: "Canadian health card number",
    regex: /\b\d{4}[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/,
  },
  { label: "Social Insurance Number", regex: /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/ },
  {
    label: "patient name label",
    regex: /\b(patient name|full name|mr\.|mrs\.|ms\.)\s*:\s*[A-Z][a-z]+/i,
  },
  {
    label: "date of birth with identifier",
    regex: /\b(dob|date of birth)\s*:\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/i,
  },
  {
    label: "medical record number",
    regex: /\b(mrn|health number|ramq|ohip|phn)\s*#?\s*:?\s*\w{6,}/i,
  },
  {
    label: "street address",
    regex: /\b\d{1,5}\s+\w+(\s+\w+){0,2}\s+(street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd)\b/i,
  },
  {
    label: "Canadian postal code",
    regex: /\b[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\b/,
  },
  {
    label: "labeled patient identifier",
    regex: /\b(patient id|chart number|hospital number)\s*#?\s*:?\s*\w{4,}/i,
  },
];

/** Blocks plausible real person names (e.g. "John Smith") — allows "58M", "Patient A" */
const REAL_NAME_PATTERN =
  /\b(?!Patient\s+[A-Z]\b)(?!Case\s+[A-Z0-9]+\b)([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b/;

const ALLOWED_FICTIONAL_NAMES = new Set([
  "trainee case",
  "chest pain",
  "arm heaviness",
  "worst headache",
  "rlq tenderness",
  "neck stiffness",
]);

export function scanForPhi(text: string): string[] {
  const hits = new Set<string>();
  for (const { label, regex } of PHI_PATTERNS) {
    if (regex.test(text)) hits.add(label);
  }
  const nameMatch = text.match(REAL_NAME_PATTERN);
  if (nameMatch) {
    const phrase = nameMatch[0].toLowerCase();
    if (!ALLOWED_FICTIONAL_NAMES.has(phrase)) {
      hits.add("possible real person name (use Patient A or 58M instead)");
    }
  }
  return [...hits];
}

export function scanClinicalCaseForPhi(fields: {
  chiefComplaint: string;
  symptoms: string[];
  history: string;
  narrative: string;
  documentTexts?: { text: string }[];
  newInput?: string;
}): string[] {
  const blob = [
    fields.chiefComplaint,
    fields.symptoms.join(" "),
    fields.history,
    fields.narrative,
    fields.newInput ?? "",
    ...(fields.documentTexts?.map((d) => d.text) ?? []),
  ].join("\n");

  return scanForPhi(blob);
}

export const PHI_BLOCK_MESSAGE =
  "Blocked for safety: possible identifying information detected. Use fictional cases only (e.g. Patient A, 58M with chest pain). Remove names, addresses, health numbers, phone, and email.";
