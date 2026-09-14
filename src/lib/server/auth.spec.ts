import { describe, it, expect, vi } from 'vitest'
import type { Cookies } from '@sveltejs/kit'
import { SESSION_COOKIE, clearSessionCookie, generateSessionToken, setSessionCookie } from './auth'

describe('generateSessionToken', () => {
	it('returns a 48-character hex token that does not repeat', () => {
		const tokens = new Set(Array.from({ length: 100 }, () => generateSessionToken()))

		expect(tokens.size).toBe(100)
		for (const token of tokens) expect(token).toMatch(/^[0-9a-f]{48}$/)
	})
})

describe('session cookie', () => {
	it('is set site-wide, http-only and lax, and cleared the same way', () => {
		const cookies = { set: vi.fn(), delete: vi.fn() } as unknown as Cookies
		const expires = new Date('2030-01-01T00:00:00.000Z')

		setSessionCookie(cookies, 'a-token', expires)
		expect(cookies.set).toHaveBeenCalledWith(
			SESSION_COOKIE,
			'a-token',
			expect.objectContaining({ path: '/', httpOnly: true, sameSite: 'lax', expires }),
		)

		clearSessionCookie(cookies)
		expect(cookies.delete).toHaveBeenCalledWith(
			SESSION_COOKIE,
			expect.objectContaining({ path: '/', httpOnly: true }),
		)
	})
})
