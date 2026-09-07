import type { Handle } from '@sveltejs/kit'
import { get_db } from '$lib/server/db'
import {
	SESSION_COOKIE,
	clearSessionCookie,
	setSessionCookie,
	validateSession,
} from '$lib/server/auth'

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE)

	if (token) {
		const db = get_db(event.platform!.env)
		const result = await validateSession(db, token)

		if (result) {
			if (result.renewed) {
				setSessionCookie(event.cookies, token, result.session.expiresAt)
			}
			event.locals.user = result.user
			event.locals.session = result.session
		} else {
			clearSessionCookie(event.cookies)
			event.locals.user = null
			event.locals.session = null
		}
	} else {
		event.locals.user = null
		event.locals.session = null
	}

	return resolve(event)
}
