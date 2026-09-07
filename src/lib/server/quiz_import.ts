import { eq, inArray } from 'drizzle-orm'
import type { getDb } from './db'
import { category, choice, level, question, quiz } from './db/schema'
import { LEVEL_SORT_ORDER, type ImportRecord } from './quiz_records'

type Db = ReturnType<typeof getDb>

// Bound-parameter and batch limits mean large payloads have to be split.
const CHUNK = 50

function chunk<T>(items: T[], size = CHUNK) {
	const chunks: T[][] = []
	for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size))
	return chunks
}

async function ensure_levels(db: Db, names: string[]) {
	const existing = await db.select().from(level)
	const by_name = new Map(existing.map((row) => [row.name, row.id]))
	const missing = names.filter((name) => !by_name.has(name))

	if (missing.length) {
		const inserted = await db
			.insert(level)
			.values(missing.map((name) => ({ name, sortOrder: LEVEL_SORT_ORDER[name] })))
			.returning()
		for (const row of inserted) by_name.set(row.name, row.id)
	}

	return { ids: by_name, created: missing }
}

async function ensure_categories(db: Db, names: string[]) {
	const existing = await db.select().from(category)
	const by_name = new Map(existing.map((row) => [row.name, row.id]))
	const missing = names.filter((name) => !by_name.has(name))

	if (missing.length) {
		const inserted = await db
			.insert(category)
			.values(missing.map((name) => ({ name })))
			.returning()
		for (const row of inserted) by_name.set(row.name, row.id)
	}

	return { ids: by_name, created: missing }
}

type QuizSpec = { levelId: number; categoryId: number; title: string }

async function ensure_quizzes(db: Db, specs: QuizSpec[]) {
	const existing = await db.select().from(quiz)
	const key = (level_id: number, category_id: number) => `${level_id}:${category_id}`
	const by_key = new Map(existing.map((row) => [key(row.levelId, row.categoryId), row.id]))
	const missing = specs.filter((spec) => !by_key.has(key(spec.levelId, spec.categoryId)))

	if (missing.length) {
		const inserted = await db.insert(quiz).values(missing).returning()
		for (const row of inserted) by_key.set(key(row.levelId, row.categoryId), row.id)
	}

	return { ids: by_key, created: missing.map((spec) => spec.title) }
}

export async function import_questions(db: Db, records: ImportRecord[]) {
	const levels = await ensure_levels(db, [...new Set(records.map((r) => r.level))])
	const categories = await ensure_categories(db, [...new Set(records.map((r) => r.category))])

	const quiz_key = (record: ImportRecord) =>
		`${levels.ids.get(record.level)}:${categories.ids.get(record.category)}`

	const specs = new Map<string, QuizSpec>()
	for (const record of records) {
		specs.set(quiz_key(record), {
			levelId: levels.ids.get(record.level)!,
			categoryId: categories.ids.get(record.category)!,
			title: `${record.level} ${record.category}`,
		})
	}
	const quizzes = await ensure_quizzes(db, [...specs.values()])

	const existing_questions = new Map<string, string>()
	for (const batch of chunk(records.map((r) => r.source_id))) {
		const rows = await db
			.select({ id: question.id, source_id: question.source_id })
			.from(question)
			.where(inArray(question.source_id, batch))
		for (const row of rows) if (row.source_id) existing_questions.set(row.source_id, row.id)
	}

	const order_indexes = new Map<string, number>()
	const counters = new Map<string, number>()
	for (const record of records) {
		const key = quiz_key(record)
		const next = counters.get(key) ?? 0
		counters.set(key, next + 1)
		order_indexes.set(record.source_id, next)
	}

	let created = 0
	let updated = 0

	for (const batch of chunk(records, 25)) {
		const statements = []

		for (const record of batch) {
			const existing_id = existing_questions.get(record.source_id)
			const question_id = existing_id ?? crypto.randomUUID()

			const values = {
				quizId: quizzes.ids.get(quiz_key(record))!,
				prompt: record.prompt,
				orderIndex: order_indexes.get(record.source_id) ?? 0,
				explanation: record.explanation ?? null,
				translation: record.translation ?? null,
				image: record.image ?? null,
			}

			if (existing_id) {
				updated++
				statements.push(db.update(question).set(values).where(eq(question.id, existing_id)))
				statements.push(db.delete(choice).where(eq(choice.questionId, existing_id)))
			} else {
				created++
				statements.push(
					db.insert(question).values({ id: question_id, source_id: record.source_id, ...values }),
				)
			}

			statements.push(
				db.insert(choice).values(
					record.choices.map((c) => ({
						questionId: question_id,
						text: c.text,
						isCorrect: c.is_correct,
					})),
				),
			)
		}

		await db.batch(statements as [(typeof statements)[number], ...typeof statements])
	}

	return {
		created,
		updated,
		levels_created: levels.created,
		categories_created: categories.created,
		quizzes_created: quizzes.created,
	}
}
