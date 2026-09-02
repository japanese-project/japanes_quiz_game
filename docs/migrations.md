# Database Migrations

We use Drizzle Kit against Cloudflare D1. Schema lives in `src/lib/server/db/schema.ts` — that file is the source of truth, never edit the database or generated SQL by hand.

## Setup (once)

Copy `.env.example` to `.env` and fill in real values:

```
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
```

## Workflow

1. Edit table definitions in `src/lib/server/db/schema.ts`.
2. Generate a migration:
   ```
   npm run db:generate
   ```
   This diffs your schema against the last migration and writes a new `.sql` file into `drizzle/`. No database connection needed for this step.
3. Apply it:
   ```
   npm run db:migrate
   ```
   This runs the pending SQL file(s) against the real D1 database.

## Rules

- **Commit the generated files.** Everything under `drizzle/` (the `.sql` file and `meta/`) goes into git with your schema change, same commit/PR. Anyone who pulls your branch runs `db:migrate` to get the same database.
- **Never hand-edit a migration file** once it's generated or merged. If the schema was wrong, change `schema.ts` and generate a new migration on top — don't rewrite history.
- **Never run `db:push`** against the shared D1 database. It writes schema changes directly with no migration file, so nobody else can reproduce it and there's no history. `db:generate` + `db:migrate` only.
- **One PR, one migration.** Don't bundle unrelated schema changes into a single generated file — makes it harder to tell what changed and why.
