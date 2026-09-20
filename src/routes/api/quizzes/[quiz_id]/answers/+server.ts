import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { check_answer, reveal_answer } from '$lib/server/quiz_read'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request, platform }) => {
	const body = (await request.json().catch(() => null)) as {
		choice_id?: unknown
		question_id?: unknown
	} | null
	const choice_id = typeof body?.choice_id === 'string' ? body.choice_id : ''
	const question_id = typeof body?.question_id === 'string' ? body.question_id : ''

	if (!choice_id && !question_id) {
		error(400, 'A choice_id or question_id is required.')
	}

	const result = choice_id
		? await check_answer(get_db(platform!.env), params.quiz_id, choice_id)
		: await reveal_answer(get_db(platform!.env), params.quiz_id, question_id)

	if (!result) {
		error(404, 'That answer does not belong to this quiz.')
	}

	return json(result)
}
