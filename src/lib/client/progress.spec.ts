import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {
	emptyProgress,
	getLastResult,
	getRankings,
	getSession,
	saveQuizResult,
	signIn,
	signOut,
	type UserProfiles,
} from './progress'

// progress.ts is browser code, but its logic is pure apart from the storage calls, so the
// node project gives it a Map-backed localStorage instead of booting a browser for it.
function fake_storage(): Storage {
	const store = new Map<string, string>()
	return {
		getItem: (key) => store.get(key) ?? null,
		setItem: (key, value) => void store.set(key, String(value)),
		removeItem: (key) => void store.delete(key),
		clear: () => store.clear(),
		key: (index) => [...store.keys()][index] ?? null,
		get length() {
			return store.size
		},
	}
}

beforeEach(() => {
	vi.stubGlobal('localStorage', fake_storage())
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('getSession', () => {
	it('reports no session when nothing is stored', () => {
		expect(getSession()).toEqual({ username: '', profiles: {}, progress: emptyProgress() })
	})

	it('migrates the legacy progress key into the profile', () => {
		const legacy = {
			N4: { score: 30, answered: 5, best: 30 },
			N3: { score: 0, answered: 0, best: 0 },
		}
		localStorage.setItem('jq-username', 'sakura')
		localStorage.setItem('jq-progress', JSON.stringify(legacy))

		expect(getSession().progress).toEqual(legacy)
		expect(localStorage.getItem('jq-progress')).toBeNull()
	})
})

describe('signIn', () => {
	it('starts a new user on an empty profile', () => {
		signIn('sakura')

		expect(getSession()).toEqual({
			username: 'sakura',
			profiles: { sakura: emptyProgress() },
			progress: emptyProgress(),
		})
	})

	it('keeps the progress of a returning user', () => {
		signIn('sakura')
		saveQuizResult('sakura', { level: 'N4', score: 30, correct: 3, total: 10 })
		signIn('sakura')

		expect(getSession().progress.N4).toEqual({ score: 30, answered: 10, best: 30 })
	})
})

describe('signOut', () => {
	it('clears the session but keeps the saved profiles', () => {
		signIn('sakura')
		saveQuizResult('sakura', { level: 'N4', score: 30, correct: 3, total: 10 })
		signOut()

		expect(getSession().username).toBe('')
		expect(getLastResult()).toBeNull()
		expect(getSession().profiles.sakura.N4.score).toBe(30)
	})
})

describe('saveQuizResult', () => {
	it('adds the score and the answered count to the level', () => {
		saveQuizResult('sakura', { level: 'N4', score: 30, correct: 3, total: 10 })
		saveQuizResult('sakura', { level: 'N4', score: 50, correct: 5, total: 10 })

		expect(getSession().profiles.sakura.N4).toEqual({ score: 80, answered: 20, best: 50 })
	})

	it('keeps the best single round rather than the latest', () => {
		saveQuizResult('sakura', { level: 'N3', score: 70, correct: 7, total: 10 })
		saveQuizResult('sakura', { level: 'N3', score: 20, correct: 2, total: 10 })

		expect(getSession().profiles.sakura.N3.best).toBe(70)
	})

	it('stores the round so the result screen can replay it', () => {
		const result = {
			level: 'N4' as const,
			score: 30,
			correct: 3,
			total: 10,
			quiz_id: 'quiz-1',
			mode: 'medium' as const,
		}
		saveQuizResult('sakura', result)

		expect(getLastResult()).toEqual(result)
	})

	it('leaves the other level untouched', () => {
		saveQuizResult('sakura', { level: 'N4', score: 30, correct: 3, total: 10 })

		expect(getSession().profiles.sakura.N3).toEqual({ score: 0, answered: 0, best: 0 })
	})
})

describe('getLastResult', () => {
	it('returns null when no round has been played', () => {
		expect(getLastResult()).toBeNull()
	})

	it('returns null rather than throwing when the stored value is corrupt', () => {
		localStorage.setItem('jq-last-result', 'not json')

		expect(getLastResult()).toBeNull()
	})
})

describe('getRankings', () => {
	it('orders by total score, then by accuracy', () => {
		const profiles: UserProfiles = {
			sakura: { N4: { score: 8, answered: 10, best: 5 }, N3: { score: 0, answered: 0, best: 0 } },
			kenji: {
				N4: { score: 5, answered: 10, best: 5 },
				N3: { score: 3, answered: 5, best: 3 },
			},
			yuki: { N4: { score: 8, answered: 20, best: 4 }, N3: { score: 0, answered: 0, best: 0 } },
		}

		expect(getRankings(profiles)).toEqual([
			{ username: 'sakura', totalScore: 8, answered: 10, accuracy: 80 },
			{ username: 'kenji', totalScore: 8, answered: 15, accuracy: 53 },
			{ username: 'yuki', totalScore: 8, answered: 20, accuracy: 40 },
		])
	})

	it('reports zero accuracy for a user who has answered nothing', () => {
		expect(getRankings({ sakura: emptyProgress() })).toEqual([
			{ username: 'sakura', totalScore: 0, answered: 0, accuracy: 0 },
		])
	})
})
