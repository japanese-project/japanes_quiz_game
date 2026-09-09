import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { get_quiz_questions } from '$lib/server/quiz_read'
import { MAX_QUESTIONS_PER_ROUND, QUESTIONS_PER_ROUND } from '$lib/quiz_config'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, url, platform }) => {
	const requested = Number(url.searchParams.get('limit') ?? QUESTIONS_PER_ROUND)
	const limit = Number.isInteger(requested)
		? Math.min(Math.max(requested, 1), MAX_QUESTIONS_PER_ROUND)
		: QUESTIONS_PER_ROUND

	const quiz = await get_quiz_questions(get_db(platform!.env), params.quiz_id, limit)

	if (!quiz) {
		error(404, 'Quiz not found.')
	}

	return json(quiz)
}
