import { error, json } from '@sveltejs/kit'
import { count, countDistinct, desc, eq, max, sum } from 'drizzle-orm'
import { get_db } from '$lib/server/db'
import { quiz_attempts } from '$lib/server/db/schema'
import { import_questions } from '$lib/server/quiz_import'
import { validate_records } from '$lib/server/quiz_records'
import type { RequestHandler } from './$types'

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50


function int_param(raw: string | null, fallback: number) {
	const parsed = raw === null || raw === '' ? NaN : Number(raw)
	return Number.isInteger(parsed) ? parsed : fallback
}

export const POST: RequestHandler = async ({ request, platform }) => {
	const expected = platform!.env.IMPORT_TOKEN

	if (!expected) {
		error(503, 'Import is not configured. Set the IMPORT_TOKEN secret.')
	}

	const provided = request.headers.get('authorization')?.replace(/^Bearer /, '')
	if (provided !== expected) {
		error(401, 'Invalid or missing import token.')
	}

	const body = await request.json().catch(() => null)
	const { valid, skipped, fatal } = validate_records(body)

	if (fatal) {
		error(400, fatal)
	}

	const result = valid.length
		? await import_questions(get_db(platform!.env), valid)
		: { created: 0, updated: 0, levels_created: [], categories_created: [], quizzes_created: [] }

	return json({
		received: valid.length + skipped.length,
		imported: result.created,
		updated: result.updated,
		skipped,
		levels_created: result.levels_created,
		categories_created: result.categories_created,
		quizzes_created: result.quizzes_created,
	})
}

/* GET /api/quiz?page=1&limit=10 — the signed-in user's quiz attempt history, most recent first.*/
export const GET: RequestHandler = async ({ url, locals, platform }) => {
	const db = get_db(platform!.env)

	if (!locals.user) {
		error(401, 'Not authenticated.')
	}

	const page = Math.max(1, int_param(url.searchParams.get('page'), 1))
	const limit = Math.min(
		MAX_LIMIT,
		Math.max(1, int_param(url.searchParams.get('limit'), DEFAULT_LIMIT)),
	)
	const offset = (page - 1) * limit

	const mine = eq(quiz_attempts.user_id, locals.user.id)

	const [row] = await db
		.select({
			attempts: count(),
			total_score: sum(quiz_attempts.score),
			correct: sum(quiz_attempts.correct_count),
			answered: sum(quiz_attempts.total_questions),
			best: max(quiz_attempts.score),
			quizzes_played: countDistinct(quiz_attempts.quiz_id),
		})
		.from(quiz_attempts)
		.where(mine)

	const totals = {
		attempts: row.attempts,
		total_score: Number(row.total_score ?? 0),
		correct: Number(row.correct ?? 0),
		answered: Number(row.answered ?? 0),
		best: Number(row.best ?? 0),
		quizzes_played: row.quizzes_played,
	}

	const summary = {
		...totals,
		accuracy: totals.answered ? Math.round((totals.correct / totals.answered) * 100) : 0,
	}

	const items = await db
		.select()
		.from(quiz_attempts)
		.where(mine)
		.orderBy(desc(quiz_attempts.completed_at), desc(quiz_attempts.id))
		.limit(limit)
		.offset(offset)

	return json({
		summary,
		items,
		page,
		limit,
		total: summary.attempts,
		has_more: offset + items.length < summary.attempts,
	})
}
