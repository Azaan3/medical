import { APP_MODE } from "@/lib/config";

export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <strong className="font-semibold">Educational simulator — Canada</strong>.
      School/personal learning with <strong>fictional cases only</strong>.{" "}
      <strong>Not medical advice.</strong> Not for real patients. Not Health
      Canada approved. Minors need parent/guardian supervision for accounts and
      deployment.
    </div>
  );
}
