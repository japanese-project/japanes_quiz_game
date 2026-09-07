import { error, json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { import_questions } from '$lib/server/quiz_import'
import { validate_records } from '$lib/server/quiz_records'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, platform }) => {
	const expected = platform!.env.IMPORT_TOKEN

	// Fail closed: an unset token must not leave the endpoint open, since anyone who
	// reached it could otherwise replace every question in the game.
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
