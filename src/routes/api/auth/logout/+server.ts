import { json } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import { clearSessionCookie, invalidateSession } from '$lib/server/auth'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, locals, platform }) => {
	if (locals.session) {
		await invalidateSession(get_db(platform?.env), locals.session.id)
	}

	clearSessionCookie(cookies)

	return json({ success: true })
}
