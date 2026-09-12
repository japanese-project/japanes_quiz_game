import { redirect, error } from '@sveltejs/kit'
import type { Level } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals, params }) => {
	if (!locals.user) redirect(303, '/')

	const level = params.level.toUpperCase()
	if (level !== 'N4' && level !== 'N3') error(404, 'Quiz level not found')

	return { user: locals.user, level: level as Level }
}
