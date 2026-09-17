export const QUESTION_TIME_SECONDS = 20

const MAX_SCORE_HUNDREDTHS = 100
const SCORE_HUNDREDTHS_PER_SECOND = 5

/**
 * Returns the points earned for one question.
 *
 * Scores are calculated as integer hundredths before conversion to a decimal,
 * so every result follows the scoring table without floating-point drift.
 */
export function calculateScore(timeRemaining: number, isCorrect: boolean): number {
	if (!isCorrect || !Number.isFinite(timeRemaining)) return 0

	const wholeSeconds = Math.max(0, Math.floor(timeRemaining))
	const scoreHundredths =
		wholeSeconds >= 19
			? MAX_SCORE_HUNDREDTHS
			: Math.min(MAX_SCORE_HUNDREDTHS, wholeSeconds * SCORE_HUNDREDTHS_PER_SECOND)

	return scoreHundredths / 100
}

/** Keeps persisted and aggregated scores at the same two-decimal precision. */
export function roundScore(score: number): number {
	return Math.round(score * 100) / 100
}

export function formatScore(score: number): string {
	return roundScore(score).toFixed(2)
}
