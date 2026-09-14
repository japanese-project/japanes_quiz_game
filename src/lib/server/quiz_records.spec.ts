import { describe, it, expect } from 'vitest'
import { validate_records, type ImportRecord } from './quiz_records'

const choices = () => [
	{ text: 'より', is_correct: true },
	{ text: 'から', is_correct: false },
	{ text: 'まで', is_correct: false },
]

const record = (overrides: Partial<Record<string, unknown>> = {}) => ({
	source_id: 'q1',
	level: 'N4',
	category: 'Grammar',
	prompt: '今日は昨日＿＿暖かい。',
	choices: choices(),
	...overrides,
})

describe('validate_records', () => {
	it('keeps a valid record and trims its fields', () => {
		const { valid, skipped, fatal } = validate_records([
			record({ source_id: ' q1 ', prompt: ' 今日は昨日＿＿暖かい。 ', explanation: '   ' }),
		])

		expect(fatal).toBeNull()
		expect(skipped).toEqual([])
		expect(valid).toEqual([
			{
				source_id: 'q1',
				level: 'N4',
				category: 'Grammar',
				prompt: '今日は昨日＿＿暖かい。',
				explanation: undefined,
				translation: undefined,
				image: undefined,
				choices: choices(),
			} satisfies ImportRecord,
		])
	})

	it('rejects a body that is not an array', () => {
		const { valid, fatal } = validate_records({ source_id: 'q1' })

		expect(fatal).toBe('Body must be a JSON array of question records.')
		expect(valid).toEqual([])
	})

	it('accepts an empty array', () => {
		expect(validate_records([])).toEqual({ valid: [], skipped: [], fatal: null })
	})

	it('labels a record with no source_id by its position', () => {
		const { skipped } = validate_records([record({ source_id: '  ' })])

		expect(skipped).toEqual([{ source_id: 'index 0', reason: 'missing source_id' }])
	})

	it('skips a source_id that appears twice in one payload', () => {
		const { valid, skipped } = validate_records([record(), record({ prompt: 'べつの問題' })])

		expect(valid).toHaveLength(1)
		expect(skipped).toEqual([{ source_id: 'q1', reason: 'duplicate source_id in payload' }])
	})

	it('rejects a level the app does not ship', () => {
		const { skipped } = validate_records([record({ level: 'N5' })])

		expect(skipped).toEqual([{ source_id: 'q1', reason: 'unknown level "N5"' }])
	})

	it('rejects a missing category or prompt', () => {
		expect(validate_records([record({ category: '' })]).skipped).toEqual([
			{ source_id: 'q1', reason: 'missing category' },
		])
		expect(validate_records([record({ prompt: '   ' })]).skipped).toEqual([
			{ source_id: 'q1', reason: 'missing prompt' },
		])
	})

	it('rejects fewer than three choices', () => {
		const { skipped } = validate_records([record({ choices: choices().slice(0, 2) })])

		expect(skipped).toEqual([{ source_id: 'q1', reason: 'fewer than 3 choices' }])
	})

	it('rejects a choice without text or without a boolean is_correct', () => {
		const { skipped } = validate_records([
			record({
				choices: [
					{ text: 'より', is_correct: true },
					{ text: '', is_correct: false },
					{ text: 'まで', is_correct: 'no' },
				],
			}),
		])

		expect(skipped).toEqual([
			{ source_id: 'q1', reason: 'every choice needs a non-empty text and a boolean is_correct' },
		])
	})

	it('rejects duplicate choice text', () => {
		const { skipped } = validate_records([
			record({
				choices: [
					{ text: 'より', is_correct: true },
					{ text: 'より', is_correct: false },
					{ text: 'まで', is_correct: false },
				],
			}),
		])

		expect(skipped).toEqual([{ source_id: 'q1', reason: 'duplicate choice text' }])
	})

	it('requires exactly one correct choice', () => {
		const none = record({ choices: choices().map((c) => ({ ...c, is_correct: false })) })
		const two = record({ choices: choices().map((c) => ({ ...c, is_correct: true })) })
		const reason = 'exactly one choice must be correct'

		expect(validate_records([none]).skipped).toEqual([{ source_id: 'q1', reason }])
		expect(validate_records([two]).skipped).toEqual([{ source_id: 'q1', reason }])
	})

	it('rejects both records when one prompt has two different answers', () => {
		const disagreeing = choices().map((choice) => ({
			...choice,
			is_correct: choice.text === 'から',
		}))
		const { valid, skipped } = validate_records([
			record({ source_id: 'q1' }),
			record({ source_id: 'q2', choices: disagreeing }),
		])

		expect(valid).toEqual([])
		expect(skipped.map((entry) => entry.source_id)).toEqual(['q1', 'q2'])
		expect(skipped[0].reason).toContain('prompt is ambiguous')
	})

	it('keeps the first of two records sharing a prompt and an answer', () => {
		const { valid, skipped } = validate_records([
			record({ source_id: 'q1' }),
			record({ source_id: 'q2' }),
		])

		expect(valid.map((entry) => entry.source_id)).toEqual(['q1'])
		expect(skipped).toEqual([{ source_id: 'q2', reason: 'duplicate prompt of q1' }])
	})
})
