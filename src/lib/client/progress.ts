import type { Level, UserProgress } from '$lib/types'

const USERNAME_KEY = 'jq-username'
const USERS_KEY = 'jq-users'
const RESULT_KEY = 'jq-last-result'
const LEGACY_PROGRESS_KEY = 'jq-progress'

export type UserProfiles = Record<string, UserProgress>
export type QuizResult = { level: Level; score: number; correct: number; total: number }
export type Ranking = {
	username: string
	totalScore: number
	answered: number
	accuracy: number
}

export const emptyProgress = (): UserProgress => ({
	N4: { score: 0, answered: 0, best: 0 },
	N3: { score: 0, answered: 0, best: 0 },
})

function readJson<T>(key: string, fallback: T): T {
	try {
		const value = localStorage.getItem(key)
		return value ? (JSON.parse(value) as T) : fallback
	} catch {
		return fallback
	}
}

export function getSession() {
	const username = localStorage.getItem(USERNAME_KEY)?.trim() ?? ''
	let profiles = readJson<UserProfiles>(USERS_KEY, {})
	if (username && !profiles[username]) {
		const legacyProgress = readJson<UserProgress | null>(LEGACY_PROGRESS_KEY, null)
		profiles = { ...profiles, [username]: legacyProgress ?? emptyProgress() }
		localStorage.setItem(USERS_KEY, JSON.stringify(profiles))
		localStorage.removeItem(LEGACY_PROGRESS_KEY)
	}
	return { username, profiles, progress: profiles[username] ?? emptyProgress() }
}

export function signIn(username: string) {
	const profiles = readJson<UserProfiles>(USERS_KEY, {})
	const nextProfiles = profiles[username] ? profiles : { ...profiles, [username]: emptyProgress() }
	localStorage.setItem(USERNAME_KEY, username)
	localStorage.setItem(USERS_KEY, JSON.stringify(nextProfiles))
}

export function signOut() {
	localStorage.removeItem(USERNAME_KEY)
	localStorage.removeItem(RESULT_KEY)
}

export function saveQuizResult(username: string, result: QuizResult) {
	const profiles = readJson<UserProfiles>(USERS_KEY, {})
	const progress = profiles[username] ?? emptyProgress()
	const previous = progress[result.level]
	const nextProgress: UserProgress = {
		...progress,
		[result.level]: {
			score: previous.score + result.score,
			answered: previous.answered + result.total,
			best: Math.max(previous.best, result.score),
		},
	}
	localStorage.setItem(USERS_KEY, JSON.stringify({ ...profiles, [username]: nextProgress }))
	localStorage.setItem(RESULT_KEY, JSON.stringify(result))
}

export function getLastResult() {
	return readJson<QuizResult | null>(RESULT_KEY, null)
}

export function getRankings(profiles: UserProfiles): Ranking[] {
	return Object.entries(profiles)
		.map(([username, progress]) => {
			const totalScore = progress.N4.score + progress.N3.score
			const answered = progress.N4.answered + progress.N3.answered
			return {
				username,
				totalScore,
				answered,
				accuracy: answered ? Math.round((totalScore / (answered * 10)) * 100) : 0,
			}
		})
		.sort((a, b) => b.totalScore - a.totalScore || b.accuracy - a.accuracy)
}
