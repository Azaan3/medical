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
];

export function scanForPhi(text: string): string[] {
  const hits = new Set<string>();
  for (const { label, regex } of PHI_PATTERNS) {
    if (regex.test(text)) hits.add(label);
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
  "Possible patient identifying information detected. Training mode allows fictional or de-identified cases only. Remove names, health card numbers, phone numbers, emails, and MRNs.";
