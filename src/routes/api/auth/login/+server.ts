import { eq } from 'drizzle-orm'
import { error, json } from '@sveltejs/kit'
import { getDb } from '$lib/server/db'
import { user } from '$lib/server/db/schema'
import { createSession, invalidateSession, setSessionCookie } from '$lib/server/auth'
import type { RequestHandler } from './$types'

const MIN_USERNAME_LENGTH = 2
const MAX_USERNAME_LENGTH = 24

export const POST: RequestHandler = async ({ request, cookies, locals, platform }) => {
	const body = (await request.json().catch(() => null)) as { username?: unknown } | null
	const username = typeof body?.username === 'string' ? body.username.trim() : ''

	if (username.length < MIN_USERNAME_LENGTH) {
		error(400, `Please enter a username with at least ${MIN_USERNAME_LENGTH} characters.`)
	}

	if (username.length > MAX_USERNAME_LENGTH) {
		error(400, `Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`)
	}

	const db = getDb(platform!.env.DB)
	const account =
		(await db.query.user.findFirst({ where: eq(user.username, username) })) ??
		(await db.insert(user).values({ username }).onConflictDoNothing().returning()).at(0) ??
		// `username` is unique: a concurrent signup can win the race between the select and insert.
		(await db.query.user.findFirst({ where: eq(user.username, username) }))

	if (!account) {
		error(500, 'Could not sign in. Please try again.')
	}

	if (locals.session) {
		await invalidateSession(db, locals.session.id)
	}

	const { token, expiresAt } = await createSession(db, account.id)
	setSessionCookie(cookies, token, expiresAt)

	return json({ user: { id: account.id, username: account.username } })
}
