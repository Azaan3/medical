export const CONSENT_VERSION = "2026-06-edu-v1";

export interface UserConsent {
  version: string;
  educationalOnly: boolean;
  fictionalCasesOnly: boolean;
  notMedicalAdvice: boolean;
  noRealPatients: boolean;
  parentalPermission: boolean;
  age13OrWithGuardian: boolean;
}

export const REQUIRED_CONSENT_CHECKS = [
  {
    id: "educationalOnly" as const,
    label:
      "This is an educational school/personal project — not a hospital or commercial medical product.",
  },
  {
    id: "fictionalCasesOnly" as const,
    label:
      "I will only enter fictional or fully made-up practice cases (no real people).",
  },
  {
    id: "notMedicalAdvice" as const,
    label:
      "Output is NOT medical advice. I will not use it to diagnose or treat anyone.",
  },
  {
    id: "noRealPatients" as const,
    label:
      "I will not enter names, health card numbers, phone numbers, emails, or real patient records.",
  },
  {
    id: "parentalPermission" as const,
    label:
      "I am 13+ and my parent/guardian knows about this project and any online accounts (GitHub, Vercel, OpenAI).",
  },
  {
    id: "age13OrWithGuardian" as const,
    label:
      "I understand misuse (real patient data, claiming this is a real doctor app) could cause legal and ethical problems.",
  },
];

export function validateConsent(consent: unknown): consent is UserConsent {
  if (!consent || typeof consent !== "object") return false;
  const c = consent as UserConsent;
  return (
    c.version === CONSENT_VERSION &&
    c.educationalOnly === true &&
    c.fictionalCasesOnly === true &&
    c.notMedicalAdvice === true &&
    c.noRealPatients === true &&
    c.parentalPermission === true &&
    c.age13OrWithGuardian === true
  );
}

export const CONSENT_STORAGE_KEY = "clinical-copilot-consent-v1";

export function buildFullConsent(): UserConsent {
  return {
    version: CONSENT_VERSION,
    educationalOnly: true,
    fictionalCasesOnly: true,
    notMedicalAdvice: true,
    noRealPatients: true,
    parentalPermission: true,
    age13OrWithGuardian: true,
  };
}

export const CONSENT_BLOCK_MESSAGE =
  "Safety consent required. Refresh the page and accept all safety checkboxes before using this educational simulator.";
