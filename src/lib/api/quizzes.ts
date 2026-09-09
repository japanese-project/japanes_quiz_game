import type { AnswerResult, Level, Quiz, QuizSummary } from '$lib/types'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
	const response = await fetch(url, init).catch(() => null)

	if (!response) {
		throw new Error('Could not reach the server. Please check your connection.')
	}

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { message?: string } | null
		throw new Error(body?.message ?? 'Something went wrong. Please try again.')
	}

	return response.json() as Promise<T>
}

export async function fetch_quizzes(level: Level) {
	const { quizzes } = await request<{ quizzes: QuizSummary[] }>(
		`/api/quizzes?level=${encodeURIComponent(level)}`,
	)
	return quizzes
}

export function fetch_quiz(quiz_id: string, limit?: number) {
	const query = limit ? `?limit=${limit}` : ''
	return request<Quiz>(`/api/quizzes/${quiz_id}${query}`)
}

export function submit_answer(quiz_id: string, choice_id: string) {
	return request<AnswerResult>(`/api/quizzes/${quiz_id}/answers`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ choice_id }),
	})
}
