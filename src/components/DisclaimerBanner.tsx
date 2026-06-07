export function DisclaimerBanner() {
  return (
    <div
      role="alert"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <strong className="font-semibold">Licensed physicians only.</strong> This
      tool provides clinical decision support — not a definitive diagnosis or
      prescription. You are responsible for all clinical decisions. Not validated
      as a medical device; verify against local guidelines and regulations
      (FDA, EU MDR, etc.) before clinical use.
    </div>
  );
}
