import { error } from '@sveltejs/kit'
import type { Level } from '$lib/types'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
	const level = params.level.toUpperCase()
	if (level !== 'N4' && level !== 'N3') error(404, 'Quiz level not found')
	return { level: level as Level }
}
