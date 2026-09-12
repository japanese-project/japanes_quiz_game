import { error } from '@sveltejs/kit'
import { getRequestEvent, query } from '$app/server'
import { countDistinct, desc, eq, sum } from 'drizzle-orm'
import { get_db } from '$lib/server/db'
import { quiz_attempts, users } from '$lib/server/db/schema'
import type { LeaderboardEntry } from '$lib/types'

const PAGE_SIZE = 10
const REFRESH_INTERVAL_MS = 1_000

type LeaderboardPage = {
	items: LeaderboardEntry[]
	page: number
	total: number
	totalPages: number
	hasPrevious: boolean
	hasNext: boolean
}

function normalize_page(value: unknown) {
	return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : 1
}

async function read_leaderboard_page(db: ReturnType<typeof get_db>, requested_page: number) {
	const [count_row] = await db
		.select({ total: countDistinct(users.id) })
		.from(quiz_attempts)
		.innerJoin(users, eq(users.id, quiz_attempts.user_id))

	const total = Number(count_row?.total ?? 0)
	const totalPages = Math.ceil(total / PAGE_SIZE)
	const page = totalPages ? Math.min(requested_page, totalPages) : 1
	const offset = (page - 1) * PAGE_SIZE

	const rows = await db
		.select({ username: users.username, totalScore: sum(quiz_attempts.score) })
		.from(quiz_attempts)
		.innerJoin(users, eq(users.id, quiz_attempts.user_id))
		.groupBy(users.id)
		.orderBy(
			desc(sum(quiz_attempts.score)),
			desc(sum(quiz_attempts.correct_count)),
			desc(sum(quiz_attempts.total_questions)),
		)
		.limit(PAGE_SIZE)
		.offset(offset)

	return {
		items: rows.map(({ username, totalScore }) => ({
			username,
			totalScore: Number(totalScore ?? 0),
		})),
		page,
		total,
		totalPages,
		hasPrevious: page > 1,
		hasNext: page < totalPages,
	} satisfies LeaderboardPage
}

/** Streams the requested leaderboard page while it is displayed by a signed-in learner. */
export const watchLeaderboard = query.live('unchecked', async function* (input: unknown) {
	// Cloudflare Workers does not provide AsyncLocalStorage, so read request data before awaiting.
	const event = getRequestEvent()
	if (!event.locals.user) error(401, 'Not authenticated.')

	const db = get_db(event.platform?.env)
	const requested_page = normalize_page(input)

	while (true) {
		yield await read_leaderboard_page(db, requested_page)
		await new Promise<void>((resolve) => setTimeout(resolve, REFRESH_INTERVAL_MS))
	}
})
