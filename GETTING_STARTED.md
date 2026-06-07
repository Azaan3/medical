# Start here — full guide (Canada, training mode)

One document for the whole journey. Do steps in order.

---

## Phase A — Get the app online (today, ~30 min)

### A1. Push latest code (GitHub Desktop)

1. Open **GitHub Desktop**
2. Repository: **medical**
3. You should see changed files in the left list
4. Bottom left:
   - **Summary:** `Canada training mode and sample cases`
   - Click **Commit to main**
5. Top bar: **Push origin** (or **Publish** if shown)

### A2. Deploy on Vercel

1. [vercel.com](https://vercel.com) → **Continue with GitHub**
2. **Add New → Project** → import **medical**
3. **Deploy** (wait ~2 min)
4. **Settings → Environment Variables**
   - `OPENAI_API_KEY` = your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
5. **Deployments → ⋯ → Redeploy**

### A3. Open your app

- Click **Visit** on Vercel
- Accept the training popup
- Click a **sample case** → type in chat: `What are the top differentials?` → **Update**

**You only need to do Phase A once.**

---

## Phase B — How to use it as a med student (weekly)

1. Pick a **sample case** or write your own fictional patient
2. Never use real names or health card numbers
3. Fill vitals / labs if you have them
4. Chat as new findings appear:
   - `Added troponin 45 ng/L`
   - `What cannot-miss diagnoses should I rule out?`
5. Compare AI output to:
   - Your textbooks
   - UpToDate (if your school provides it)
   - A preceptor or tutor

**Goal:** learn differential diagnosis thinking, not treat patients.

---

## Phase C — Make it smarter (optional, ongoing)

Add files to `knowledge/` on your Mac:

```
Medical/knowledge/my-notes/
  choosing-wisely-examples.md
  ed-chest-pain-checklist.txt
```

Then GitHub Desktop → Commit → Push → Vercel auto-redeploys.

Good free/public sources to summarize into your own notes (don’t copy copyrighted text wholesale):

- [Choosing Wisely Canada](https://choosingwiselycanada.org/)
- Public Health Agency of Canada
- Your school’s case banks (de-identified)

---

## Phase D — Before any real patients (years away)

| Requirement | Who helps |
|-------------|-----------|
| Medical degree + license | You + your university |
| Clinical advisor (staff MD) | Find via school / research |
| Health Canada classification | Health-tech lawyer |
| Privacy (PIPEDA + provincial) | Lawyer + compliant hosting |
| Validation study | Advisor + statistician |
| Hospital pilot agreement | Hospital admin + ethics |

**Do not skip this for real patient care.**

---

## Phase E — Costs (rough)

| Item | Cost |
|------|------|
| GitHub (private repo) | Free |
| Vercel hobby | Free tier |
| OpenAI API | Pay per use (~few cents per case) |
| Lawyer / regulatory | $$$ later |
| Health Canada submission | $$$$ if classified as device |

---

## Phase F — Troubleshooting

| Problem | Fix |
|---------|-----|
| AI says API key missing | Add `OPENAI_API_KEY` on Vercel, redeploy |
| PHI blocked message | Remove names, emails, phone numbers |
| Empty assessment | Check Vercel function logs |
| GitHub push fails | System Settings → allow GitHub Desktop |

---

## Phase G — What to ask your AI coding assistant next

- “Add more sample cases for pediatrics”
- “Add French UI for Quebec”
- “Help me draft a one-page pitch for a physician mentor”

---

## Your checklist (print this)

- [ ] Committed + pushed on GitHub Desktop
- [ ] Deployed on Vercel
- [ ] OPENAI_API_KEY set + redeployed
- [ ] Tried one sample case successfully
- [ ] Repo set to **Private** on GitHub (recommended)
- [ ] Found one physician mentor (long-term)
