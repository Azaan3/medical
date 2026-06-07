# Clinical Copilot

Web-based **clinical decision support (CDS)** for licensed physicians. Doctors enter structured case data, free-text narrative, and files; they collaborate with AI in chat as new symptoms appear. The system returns **ranked differentials**, **red flags**, **suggested workup**, and **citations** — never a single definitive diagnosis.

## For clinicians (no terminal)

Once deployed, open the URL in any browser. No command line.

## Deploy without using your machine’s terminal

1. Push this folder to **GitHub** (via GitHub Desktop or github.com upload).
2. Import the repo in **[Vercel](https://vercel.com)** → Deploy.
3. In Vercel → **Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` — your API key from OpenAI
   - Optional: `CLINICAL_MODEL` (default `gpt-4.1`)
4. Redeploy. Share the production URL with your team.

Same pattern works on **Railway**, **Render**, or **Azure Static Web Apps**.

## Accuracy & safety (read before clinical use)

- This is **CDS**, not an autonomous diagnostician. The treating physician decides.
- Raw LLM knowledge is **not** sufficient for life-and-death accuracy. Phase 2 adds a **verified guideline knowledge base** (RAG) you will upload.
- Not FDA-cleared or CE-marked. Regulatory path depends on your markets (US SaMD, EU MDR, etc.).
- Use HIPAA-compliant hosting and BAAs if handling real PHI.

## What to upload to improve accuracy

Place files in a project folder `knowledge/` (or send them in chat) — we will index them next:

| Priority | Content |
|----------|---------|
| High | Institutional protocols, local antibiograms, referral pathways |
| High | Specialty guidelines you trust (PDF): IDSA, NICE, WHO, etc. |
| High | Differential diagnosis checklists per chief complaint |
| Medium | Drug interaction / allergy rules |
| Medium | Red-flag / “cannot miss” lists per presentation |
| Medium | Sample de-identified cases (correct final diagnosis) for evaluation |
| Future | LOINC lab codes, SNOMED/ICD mappings if you have licenses |

**Do not upload** identifiable patient data until encryption, access control, and BAAs are in place.

## Local development (optional)

Only needed if you want to preview before cloud deploy:

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev
```

## What’s included now

- **Guideline RAG** — retrieves chunks from `knowledge/` (seed emergency pathways included)
- **PDF & text extraction** for attached case reports; **image OCR** via vision API when key is set
- **Guideline sources** shown on each assessment
- **Reindex API** — `POST /api/knowledge/reindex` after adding files (optional `ADMIN_SECRET`)

## Add your guidelines

1. Put `.md` / `.txt` files in `knowledge/` (or convert PDFs to markdown).
2. Push to GitHub and redeploy — build runs ingest automatically.
3. Or call reindex on your live URL (set `ADMIN_SECRET` in production).

With `OPENAI_API_KEY` set during **build** on Vercel, semantic embeddings are enabled; otherwise keyword search still works.

## Roadmap

- [ ] Physician login (OAuth) + audit logs + PHI-safe hosting
- [ ] Evaluation harness on your de-identified cases
- [ ] iOS / Android (PWA or native)
