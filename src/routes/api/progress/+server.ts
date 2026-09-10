import { and, count, countDistinct, eq, max, sum } from 'drizzle-orm'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { levels, quiz_attempts, quizzes } from '$lib/server/db/schema'
import type { Level, LevelProgress } from '$lib/types'

/** GET: /api/progress — a user's score & progress, optionally scoped to ?level=N4|N3. */
export const GET: RequestHandler = async ({ url, locals, platform }) => {
	const db = get_db(platform!.env)

	if (!locals.user) {
		error(401, 'Not authenticated.')
	}

	const mine = eq(quiz_attempts.user_id, locals.user.id)

	const level = url.searchParams.get('level')
	const in_level = level === 'N4' || level === 'N3' ? eq(levels.name, level) : undefined

	const rows = await db
		.select({
			level: levels.name,
			score: sum(quiz_attempts.score),
			correct: sum(quiz_attempts.correct_count),
			answered: sum(quiz_attempts.total_questions),
			best: max(quiz_attempts.score),
			attempts: count(),
			quizzes_played: countDistinct(quiz_attempts.quiz_id),
		})
		.from(quiz_attempts)
		.innerJoin(quizzes, eq(quiz_attempts.quiz_id, quizzes.id))
		.innerJoin(levels, eq(quizzes.level_id, levels.id))
		.where(in_level ? and(mine, in_level) : mine)
		.groupBy(levels.name)

	const by_level = new Map<string, LevelProgress>()
	for (const row of rows) {
		by_level.set(row.level, {
			score: Number(row.score),
			answered: Number(row.answered),
			best: Number(row.best),
		})
	}

	const default_progress: LevelProgress = { score: 0, answered: 0, best: 0 }

	const progress: Record<Level, LevelProgress> = {
		N4: by_level.get('N4') ?? default_progress,
		N3: by_level.get('N3') ?? default_progress,
	}

	const totals = rows.reduce(
		(acc, row) => ({
			total_score: acc.total_score + Number(row.score),
			correct: acc.correct + Number(row.correct),
			answered: acc.answered + Number(row.answered),
			best: Math.max(acc.best, Number(row.best)),
			attempts: acc.attempts + row.attempts,
			quizzes_played: acc.quizzes_played + row.quizzes_played,
		}),
		{ total_score: 0, correct: 0, answered: 0, best: 0, attempts: 0, quizzes_played: 0 },
	)

	const accuracy = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : 0

	return json({
		progress,
		summary: {
			...totals,
			accuracy,
		},
	})
}
