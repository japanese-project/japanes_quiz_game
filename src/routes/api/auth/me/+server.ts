import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ locals }) => {
	if (!locals.user) {
		error(401, 'Not authenticated.')
	}

	return json({ user: locals.user })
}
