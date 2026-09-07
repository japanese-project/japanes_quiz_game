# Quiz Data

Questions are content, not schema — they load through an import endpoint, not migrations. Everything lives in `src/lib/server/db/seed/`.

```
raw/*.json  --(db:seed:clean)-->  dataset.json  --(POST /api/quiz/import)-->  D1
                                  needs_review.json
```

## Setup (once)

Copy `.dev.vars.example` to `.dev.vars` and set `IMPORT_TOKEN` to any random string. In deployed environments use `wrangler secret put IMPORT_TOKEN` — the endpoint returns 503 until it's set.

## Workflow

1. Put the new dataset in `seed/raw/`, unedited.
2. Map its shape onto `ImportRecord` in `seed/clean.ts`.
3. Generate `dataset.json` and `needs_review.json`:
   ```
   pnpm db:seed:clean
   ```
4. Review the `dataset.json` diff. Send `needs_review.json` to whoever owns the content — it lists every rejected question and why.
5. Import:
   ```
   pnpm db:migrate:local
   pnpm dev
   curl -X POST http://localhost:5173/api/quiz/import \
     -H "authorization: Bearer $IMPORT_TOKEN" \
     -H 'content-type: application/json' \
     --data @src/lib/server/db/seed/dataset.json
   ```

The response reports `imported` (new), `updated` (matched on `source_id`), and `skipped` (rejects, with reasons). Anything unexpected under `quizzes_created` or `categories_created` usually means a typo in the source data.

## Rules

- **Never edit `raw/`.** It's the upstream copy — editing it makes diffs useless when the dataset is regenerated.
- **Never edit `dataset.json` by hand.** It's generated. Fix `clean.ts` or the raw file and re-run.
- **Commit both generated files** with your change, same PR — that's how question edits get reviewed.
- **Re-importing is safe.** Matched on `source_id`, so the same file can be sent repeatedly without duplicating.
- **Importing never deletes.** Removing a question from `dataset.json` leaves its row behind. Delete those by `source_id`.
