/**
 * Normalizes the upstream dataset in raw/ into dataset.json, the file the import
 * endpoint consumes. Run with `pnpm db:seed:clean`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { validate_records, type ImportRecord } from '../../quiz_records.ts'

const MIN_CHOICES = 3

const here = dirname(fileURLToPath(import.meta.url))
const RAW = join(here, 'raw', 'n3_n4_dataset.json')
const CLEANED = join(here, 'dataset.json')
const REJECTED = join(here, 'needs_review.json')

const CATEGORIES: Record<string, string> = {
	grammar: 'Grammar',
	kanji: 'Kanji',
	vocabulary: 'Vocabulary',
}

type RawRecord = {
	id: string
	question: string
	choices: string[]
	answer: string
	answer_index: number
	explanation: string
	translation: string
}

type RawDataset = {
	dataset: { categories: Array<{ level: string; type: string; records: RawRecord[] }> }
}

// Seeded so a re-run produces an identical file: an unstable shuffle would churn the
// diff on every run and make content changes impossible to review.
function seeded_shuffle<T>(items: T[], seed: string) {
	let hash = 2166136261
	for (const char of seed) {
		hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
	}

	const shuffled = [...items]
	for (let i = shuffled.length - 1; i > 0; i--) {
		hash = Math.imul(hash ^ (hash >>> 15), 2246822507)
		hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
		const j = ((hash >>> 0) % (i + 1)) | 0
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}
	return shuffled
}

const raw = JSON.parse(readFileSync(RAW, 'utf8')) as RawDataset

const candidates: ImportRecord[] = []
const rejected = []

for (const block of raw.dataset.categories) {
	const category = CATEGORIES[block.type]
	if (!category) throw new Error(`Unmapped category type "${block.type}"`)

	for (const record of block.records) {
		const answer = record.choices[record.answer_index]
		if (answer !== record.answer) {
			rejected.push({ id: record.id, reason: 'answer_index does not match answer' })
			continue
		}

		const unique = [...new Set(record.choices)]
		if (unique.length < MIN_CHOICES) {
			rejected.push({
				id: record.id,
				level: block.level,
				category,
				prompt: record.question,
				reason: `only ${unique.length} unique choice(s) after removing duplicates`,
				original_choices: record.choices,
				answer: record.answer,
			})
			continue
		}

		candidates.push({
			source_id: record.id,
			level: block.level,
			category,
			prompt: record.question,
			explanation: record.explanation,
			translation: record.translation,
			choices: seeded_shuffle(unique, record.id).map((text) => ({
				text,
				is_correct: text === answer,
			})),
		})
	}
}

// Run the endpoint's own validator so dataset.json cannot contain anything the import
// would reject, and so cross-record problems (duplicate or ambiguous prompts) land in
// the review file rather than surfacing on every import.
const { valid, skipped } = validate_records(candidates)
const by_id = new Map(candidates.map((record) => [record.source_id, record]))

for (const entry of skipped) {
	const record = by_id.get(entry.source_id)
	rejected.push({
		id: entry.source_id,
		level: record?.level,
		category: record?.category,
		prompt: record?.prompt,
		reason: entry.reason,
		answer: record?.choices.find((c) => c.is_correct)?.text,
	})
}

const cleaned = [...valid].sort((a, b) => a.source_id.localeCompare(b.source_id))
rejected.sort((a, b) => a.id.localeCompare(b.id))

writeFileSync(CLEANED, `${JSON.stringify(cleaned, null, '\t')}\n`)
writeFileSync(REJECTED, `${JSON.stringify(rejected, null, '\t')}\n`)

const total = cleaned.length + rejected.length
console.log(`${total} records read`)
console.log(`  ${cleaned.length} written to dataset.json`)
console.log(`  ${rejected.length} written to needs_review.json`)
