/** Shared by the API and the UI so the number shown on screen cannot drift from the
 *  number the server actually serves. */
export const QUESTIONS_PER_ROUND = 10
export const MAX_QUESTIONS_PER_ROUND = 100

export type RoundModeId = 'easy' | 'medium' | 'hard'

export type RoundMode = {
	id: RoundModeId
	label: string
	/** null means every question in the category. */
	limit: number | null
	blurb: string
}

// These vary round *length*, not question difficulty — no record carries a difficulty
// field yet (see the data limitations issue), so a shorter round is all "easy" can mean.
export const ROUND_MODES: RoundMode[] = [
	{ id: 'easy', label: 'Easy', limit: QUESTIONS_PER_ROUND, blurb: 'A short warm-up round' },
	{ id: 'medium', label: 'Medium', limit: 25, blurb: 'A longer practice round' },
	{ id: 'hard', label: 'Hard', limit: null, blurb: 'Every question in the category' },
]

export const DEFAULT_ROUND_MODE: RoundModeId = 'easy'

export function round_size(mode: RoundMode, question_count: number) {
	return mode.limit === null ? question_count : Math.min(mode.limit, question_count)
}
