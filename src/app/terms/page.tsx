import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 text-slate-800">
      <Link href="/" className="text-sm text-clinical-700 underline">
        ← Back to simulator
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-clinical-900">
        Terms of use — educational simulator
      </h1>
      <p className="mt-2 text-sm text-slate-600">Last updated: June 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        <p>
          <strong>Clinical Copilot (training mode)</strong> is an educational
          software project intended for fictional case practice only. It is not
          a medical device, not licensed by Health Canada, and not a substitute
          for professional medical judgment.
        </p>

        <h2 className="font-semibold text-base">Who may use this</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Users aged 13+ with parent/guardian knowledge of the project.</li>
          <li>Students practising made-up clinical scenarios for learning.</li>
          <li>Not for licensed clinical decision-making on real patients.</li>
        </ul>

        <h2 className="font-semibold text-base">Prohibited uses</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Entering real patient identifying information (PII/PHI).</li>
          <li>Diagnosing, treating, or advising real people based on output.</li>
          <li>Marketing or representing the app as an approved medical product.</li>
          <li>Uploading real hospital records or identifiable documents.</li>
        </ul>

        <h2 className="font-semibold text-base">No warranty</h2>
        <p>
          AI output may be wrong, incomplete, or outdated. The authors disclaim
          liability for any harm arising from use of this software. Users assume
          all responsibility for how they use it.
        </p>

        <h2 className="font-semibold text-base">Privacy</h2>
        <p>
          Do not submit personal health information. Automated checks may block
          suspected identifiers. Case text may be sent to third-party AI providers
          when an API key is configured — use fictional data only.
        </p>

        <h2 className="font-semibold text-base">Accounts</h2>
        <p>
          Minors should not create paid API or hosting accounts without
          parental/guardian supervision and permission.
        </p>

        <p className="pt-4 text-xs text-slate-500 border-t border-slate-200">
          These terms reduce risk but do not guarantee legal protection in every
          situation. Consult a parent/guardian and qualified advisors before any
          non-educational use.
        </p>
      </section>
    </main>
  );
}
