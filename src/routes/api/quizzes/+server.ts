import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { list_quizzes } from '$lib/server/quiz_read'
import { LEVEL_SORT_ORDER } from '$lib/server/quiz_records'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, platform }) => {
	const level = url.searchParams.get('level')

	if (!level || !(level in LEVEL_SORT_ORDER)) {
		error(400, `Unknown level. Expected one of: ${Object.keys(LEVEL_SORT_ORDER).join(', ')}.`)
	}

	return json({ quizzes: await list_quizzes(get_db(platform!.env), level) })
}
