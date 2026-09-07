import { json } from '@sveltejs/kit'
import { getDb } from '$lib/server/db'
import { clearSessionCookie, invalidateSession } from '$lib/server/auth'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, locals, platform }) => {
	if (locals.session) {
		await invalidateSession(getDb(platform!.env.DB), locals.session.id)
	}

	clearSessionCookie(cookies)

	return json({ success: true })
}
