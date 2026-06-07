/** Training-only — educational simulator, not clinical software. */
export const APP_MODE = "training" as const;

export const PRIMARY_REGION = "Canada";

/** Shown on every AI output */
export const OUTPUT_WATERMARK =
  "EDUCATIONAL SIMULATION ONLY — NOT MEDICAL ADVICE — DO NOT USE FOR REAL PATIENTS";

/** File uploads disabled in training (real reports often contain PHI) */
export const ALLOW_CASE_FILE_UPLOAD = false;
