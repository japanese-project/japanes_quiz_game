import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { check_answer } from '$lib/server/quiz_read'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ params, request, platform }) => {
	const body = (await request.json().catch(() => null)) as { choice_id?: unknown } | null
	const choice_id = typeof body?.choice_id === 'string' ? body.choice_id : ''

	if (!choice_id) {
		error(400, 'A choice_id is required.')
	}

	const result = await check_answer(get_db(platform!.env), params.quiz_id, choice_id)

	if (!result) {
		error(404, 'That choice does not belong to this quiz.')
	}

	return json(result)
}
