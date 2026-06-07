import { APP_MODE } from "@/lib/config";

export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <strong className="font-semibold">
        {APP_MODE === "training" ? "Training mode — Canada" : "Clinical mode"}
      </strong>
      . For medical trainees and supervised learning with{" "}
      <strong>fictional or de-identified cases only</strong>. Not for real patient
      care. Not licensed by Health Canada. No PHI (names, health card numbers).
      PIPEDA and provincial health privacy laws apply when handling real data
      elsewhere.
    </div>
  );
}
