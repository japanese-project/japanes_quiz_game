/** Validation for imported quiz records. Deliberately free of database imports so it can
 *  run under plain node (the seed cleaner) as well as in the worker. */

export const LEVEL_SORT_ORDER: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 }

const MIN_CHOICES = 3

export type ImportRecord = {
	source_id: string
	level: string
	category: string
	prompt: string
	explanation?: string
	translation?: string
	image?: string
	choices: Array<{ text: string; is_correct: boolean }>
}

export type SkippedRecord = { source_id: string; reason: string }

const is_non_empty_string = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0

const optional_string = (value: unknown) => (is_non_empty_string(value) ? value.trim() : undefined)

const correct_answer = (record: ImportRecord) => record.choices.find((c) => c.is_correct)!.text

export function validate_records(input: unknown) {
	const candidates: ImportRecord[] = []
	const skipped: SkippedRecord[] = []

	if (!Array.isArray(input)) {
		return { valid: [], skipped, fatal: 'Body must be a JSON array of question records.' }
	}

	const seen = new Set<string>()

	for (const [index, raw] of input.entries()) {
		const record = raw as Record<string, unknown>
		const source_id = is_non_empty_string(record?.source_id)
			? record.source_id.trim()
			: `index ${index}`
		const reject = (reason: string) => skipped.push({ source_id, reason })

		if (!is_non_empty_string(record?.source_id)) {
			reject('missing source_id')
			continue
		}
		if (seen.has(source_id)) {
			reject('duplicate source_id in payload')
			continue
		}
		if (!is_non_empty_string(record.level) || !(record.level.trim() in LEVEL_SORT_ORDER)) {
			reject(`unknown level ${JSON.stringify(record.level)}`)
			continue
		}
		if (!is_non_empty_string(record.category)) {
			reject('missing category')
			continue
		}
		if (!is_non_empty_string(record.prompt)) {
			reject('missing prompt')
			continue
		}
		if (!Array.isArray(record.choices) || record.choices.length < MIN_CHOICES) {
			reject(`fewer than ${MIN_CHOICES} choices`)
			continue
		}

		const choices = record.choices as Array<Record<string, unknown>>
		if (!choices.every((c) => is_non_empty_string(c?.text) && typeof c?.is_correct === 'boolean')) {
			reject('every choice needs a non-empty text and a boolean is_correct')
			continue
		}

		const texts = choices.map((c) => (c.text as string).trim())
		if (new Set(texts.map((t) => t.normalize('NFKC'))).size !== texts.length) {
			reject('duplicate choice text')
			continue
		}
		if (choices.filter((c) => c.is_correct).length !== 1) {
			reject('exactly one choice must be correct')
			continue
		}

		seen.add(source_id)
		candidates.push({
			source_id,
			level: record.level.trim(),
			category: record.category.trim(),
			prompt: record.prompt.trim(),
			explanation: optional_string(record.explanation),
			translation: optional_string(record.translation),
			image: optional_string(record.image),
			choices: texts.map((text, i) => ({ text, is_correct: Boolean(choices[i].is_correct) })),
		})
	}

	return { valid: reject_prompt_conflicts(candidates, skipped), skipped, fatal: null }
}

// Cross-record checks. Two questions sharing a prompt are either redundant or, when their
// answers disagree, unanswerable — the prompt lacks the context to prefer one. Neither is
// visible while records are validated one at a time.
function reject_prompt_conflicts(records: ImportRecord[], skipped: SkippedRecord[]) {
	const by_prompt = new Map<string, ImportRecord[]>()
	for (const record of records) {
		const key = record.prompt.normalize('NFKC').trim()
		by_prompt.set(key, [...(by_prompt.get(key) ?? []), record])
	}

	const valid: ImportRecord[] = []

	for (const group of by_prompt.values()) {
		if (group.length === 1) {
			valid.push(group[0])
			continue
		}

		if (new Set(group.map(correct_answer)).size > 1) {
			const ids = group.map((r) => r.source_id).join(', ')
			for (const record of group) {
				skipped.push({
					source_id: record.source_id,
					reason: `same prompt as ${ids} but a different correct answer — prompt is ambiguous`,
				})
			}
			continue
		}

		const [first, ...rest] = group
		valid.push(first)
		for (const record of rest) {
			skipped.push({
				source_id: record.source_id,
				reason: `duplicate prompt of ${first.source_id}`,
			})
		}
	}

	return valid
}
