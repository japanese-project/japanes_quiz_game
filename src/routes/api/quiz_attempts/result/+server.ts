import { and, eq } from 'drizzle-orm'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { quizzes, quiz_attempts } from '$lib/server/db/schema'

/** GET /api/quiz_attempts/result?attempt_id=<attempt_id> — the signed-in user's result for one quiz attempt. */
export const GET: RequestHandler = async ({ url, locals, platform }) => {
	const db = get_db(platform!.env)

	if (!locals.user) {
		error(401, 'Not authenticated.')
	}

	const attempt_id = url.searchParams.get('attempt_id')
	if (!attempt_id) {
		error(400, 'Missing attempt_id query parameter.')
	}

	const [attempt] = await db
		.select({
			id: quiz_attempts.id,
			quiz_id: quiz_attempts.quiz_id,
			quiz_title: quizzes.title,
			score: quiz_attempts.score,
			correct_count: quiz_attempts.correct_count,
			total_questions: quiz_attempts.total_questions,
			completed_at: quiz_attempts.completed_at,
		})
		.from(quiz_attempts)
		.innerJoin(quizzes, eq(quizzes.id, quiz_attempts.quiz_id))
		.where(and(eq(quiz_attempts.id, attempt_id), eq(quiz_attempts.user_id, locals.user.id)))
		.limit(1)

	if (!attempt) {
		error(404, 'Quiz result not found.')
	}

	const accuracy = attempt.total_questions
		? Math.round((attempt.correct_count / attempt.total_questions) * 100)
		: 0

	return json({
		...attempt,
		accuracy,
	})
}
