import { desc, eq, sum } from 'drizzle-orm'
import { users, quiz_attempts } from '$lib/server/db/schema'
import { get_db } from '$lib/server/db'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ platform }) => {
	const db = get_db(platform?.env)

	const rows = await db
		.select({
			username: users.username,
			score: sum(quiz_attempts.score),
			answered: sum(quiz_attempts.total_questions),
			correct: sum(quiz_attempts.correct_count),
		})
		.from(quiz_attempts)
		.innerJoin(users, eq(users.id, quiz_attempts.user_id))
		.groupBy(users.id)
		.orderBy(
			desc(sum(quiz_attempts.score)),
			desc(sum(quiz_attempts.correct_count)),
			desc(sum(quiz_attempts.total_questions)),
		)
		.limit(10)

	const ranks = rows.map(({ username, score }) => ({
		username,
		total_score: score,
	}));

	return json(ranks)
}
