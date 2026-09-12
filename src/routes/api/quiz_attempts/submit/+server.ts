import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { quiz_attempts, quizzes } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

/**
 * POST /api/quiz_attempts/submit
 *
 * Body: { quiz_id: string, score: number, correct_count: number, total_questions: number }
 *
 * Saves a completed quiz attempt for the signed-in user so it appears
 * on the leaderboard and in the user's history.
 */
export const POST: RequestHandler = async ({ request, locals, platform }) => {
	if (!locals.user) {
		error(401, 'Not authenticated.')
	}

	const body = (await request.json().catch(() => null)) as {
		quiz_id?: unknown
		score?: unknown
		correct_count?: unknown
		total_questions?: unknown
	} | null

	const quiz_id = typeof body?.quiz_id === 'string' ? body.quiz_id.trim() : ''
	const score = typeof body?.score === 'number' ? body.score : -1
	const correct_count = typeof body?.correct_count === 'number' ? body.correct_count : -1
	const total_questions = typeof body?.total_questions === 'number' ? body.total_questions : -1

	if (!quiz_id) error(400, 'quiz_id is required.')
	if (score < 0) error(400, 'score must be a non-negative number.')
	if (correct_count < 0) error(400, 'correct_count must be a non-negative number.')
	if (total_questions <= 0) error(400, 'total_questions must be a positive number.')

	const db = get_db(platform!.env)

	// Verify the quiz actually exists before inserting.
	const [quiz] = await db.select({ id: quizzes.id }).from(quizzes).where(eq(quizzes.id, quiz_id)).limit(1)
	if (!quiz) error(404, 'Quiz not found.')

	const [attempt] = await db
		.insert(quiz_attempts)
		.values({
			user_id: locals.user.id,
			quiz_id,
			score,
			correct_count,
			total_questions,
		})
		.returning({ id: quiz_attempts.id })

	return json({ attempt_id: attempt.id }, { status: 201 })
}
