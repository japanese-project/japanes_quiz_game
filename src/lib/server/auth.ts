import { eq } from 'drizzle-orm'
import { dev } from '$app/environment'
import type { Cookies } from '@sveltejs/kit'
import type { getDb } from './db'
import { session, user } from './db/schema'

type Db = ReturnType<typeof getDb>

export const SESSION_COOKIE = 'session'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30
const RENEW_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15

const toHex = (bytes: Uint8Array) =>
	Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

export function generateSessionToken() {
	return toHex(crypto.getRandomValues(new Uint8Array(24)))
}

// The cookie holds the raw token; only its hash is stored, so a leaked DB row cannot be replayed.
async function hashToken(token: string) {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
	return toHex(new Uint8Array(digest))
}

export async function createSession(db: Db, userId: string) {
	const token = generateSessionToken()
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

	await db.insert(session).values({ id: await hashToken(token), userId, expiresAt })

	return { token, expiresAt }
}

export async function validateSession(db: Db, token: string) {
	const id = await hashToken(token)
	const [found] = await db
		.select({
			sessionId: session.id,
			expiresAt: session.expiresAt,
			user: { id: user.id, username: user.username },
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, id))
		.limit(1)

	if (!found) return null

	if (found.expiresAt.getTime() <= Date.now()) {
		await invalidateSession(db, found.sessionId)
		return null
	}

	// Callers must re-issue the cookie when `renewed` is set, or the browser would still
	// drop the session at its original expiry despite the row being extended.
	let expiresAt = found.expiresAt
	const renewed = expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS

	if (renewed) {
		expiresAt = new Date(Date.now() + SESSION_TTL_MS)
		await db.update(session).set({ expiresAt }).where(eq(session.id, found.sessionId))
	}

	return { session: { id: found.sessionId, expiresAt }, user: found.user, renewed }
}

export async function invalidateSession(db: Db, sessionId: string) {
	await db.delete(session).where(eq(session.id, sessionId))
}

// `secure` is off only under `vite dev`, which serves the app over plain http://localhost.
const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	secure: !dev,
	sameSite: 'lax',
} as const

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE, token, { ...COOKIE_OPTIONS, expires: expiresAt })
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, COOKIE_OPTIONS)
}
