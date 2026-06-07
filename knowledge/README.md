# Knowledge base

Drop **de-identified** clinical guidelines here (`.md`, `.txt`, `.csv`, `.json`).

- `seed/` — built-in emergency pathways (included by default)
- Add hospital protocols as PDF → convert to `.md` or upload via your pipeline

After adding files, redeploy (build runs `npm run ingest`) or call:

`POST /api/knowledge/reindex` with header `Authorization: Bearer YOUR_ADMIN_SECRET` if set.

Semantic search activates when `OPENAI_API_KEY` is present at ingest time.
