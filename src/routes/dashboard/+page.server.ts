import { redirect } from '@sveltejs/kit'
import { eq, sum } from 'drizzle-orm'
import { get_db } from '$lib/server/db'
import { quiz_attempts } from '$lib/server/db/schema'
import { roundScore } from '$lib/scoring'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) redirect(303, '/')

	const db = get_db(platform?.env)
	const [totals] = await db
		.select({ score: sum(quiz_attempts.score) })
		.from(quiz_attempts)
		.where(eq(quiz_attempts.user_id, locals.user.id))

	return { user: locals.user, totalScore: roundScore(Number(totals?.score ?? 0)) }
}
