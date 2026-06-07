export type Sex = "male" | "female" | "other" | "unknown";

export interface PatientDemographics {
  ageYears?: number;
  sex?: Sex;
  weightKg?: number;
  region?: string;
  pregnancyStatus?: "yes" | "no" | "unknown" | "not_applicable";
}

export interface VitalSigns {
  temperatureC?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  gcs?: number;
}

export interface LabResult {
  name: string;
  value: string;
  unit?: string;
  flag?: "low" | "high" | "critical" | "normal";
}

export interface CaseDocument {
  name: string;
  text: string;
}

export interface ClinicalCase {
  id: string;
  createdAt: string;
  demographics: PatientDemographics;
  chiefComplaint: string;
  symptoms: string[];
  history: string;
  medications: string[];
  allergies: string[];
  vitals: VitalSigns;
  labs: LabResult[];
  narrative: string;
  uploadedFileNames: string[];
  documentTexts: CaseDocument[];
}

export interface DifferentialDiagnosis {
  condition: string;
  likelihood: "high" | "moderate" | "low";
  rationale: string;
  supportingFindings: string[];
  againstFindings: string[];
  suggestedWorkup: string[];
  citations: string[];
}

export interface RedFlag {
  finding: string;
  urgency: "immediate" | "urgent" | "monitor";
  action: string;
}

export interface ClinicalAssessment {
  summary: string;
  redFlags: RedFlag[];
  differentials: DifferentialDiagnosis[];
  missingInformation: string[];
  questionsToAsk: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}
