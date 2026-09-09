import { and, eq, inArray, sql } from 'drizzle-orm'
import type { get_db } from './db'
import { categories, choices, levels, questions, quizzes } from './db/schema'

type Db = ReturnType<typeof get_db>

export async function list_quizzes(db: Db, level: string) {
	return db
		.select({
			id: quizzes.id,
			title: quizzes.title,
			description: quizzes.description,
			level: levels.name,
			category: categories.name,
			question_count: sql<number>`count(${questions.id})`,
		})
		.from(quizzes)
		.innerJoin(levels, eq(quizzes.level_id, levels.id))
		.innerJoin(categories, eq(quizzes.category_id, categories.id))
		.leftJoin(questions, eq(questions.quiz_id, quizzes.id))
		.where(eq(levels.name, level))
		.groupBy(quizzes.id)
		.orderBy(categories.name)
}

/**
 * Questions for one quiz, without `is_correct` or `explanation` — both would hand the
 * answer to anyone reading the response. Correctness comes back from check_answer.
 */
export async function get_quiz_questions(db: Db, quiz_id: string, limit: number) {
	const [quiz] = await db
		.select({
			id: quizzes.id,
			title: quizzes.title,
			level: levels.name,
			category: categories.name,
		})
		.from(quizzes)
		.innerJoin(levels, eq(quizzes.level_id, levels.id))
		.innerJoin(categories, eq(quizzes.category_id, categories.id))
		.where(eq(quizzes.id, quiz_id))
		.limit(1)

	if (!quiz) return null

	const picked = await db
		.select({
			id: questions.id,
			prompt: questions.prompt,
			image: questions.image,
		})
		.from(questions)
		.where(eq(questions.quiz_id, quiz_id))
		.orderBy(sql`RANDOM()`)
		.limit(limit)

	if (!picked.length) return { ...quiz, questions: [] }

	const rows = await db
		.select({ id: choices.id, question_id: choices.question_id, text: choices.text })
		.from(choices)
		.where(
			inArray(
				choices.question_id,
				picked.map((question) => question.id),
			),
		)

	const by_question = new Map<string, Array<{ id: string; text: string }>>()
	for (const row of rows) {
		by_question.set(row.question_id, [
			...(by_question.get(row.question_id) ?? []),
			{ id: row.id, text: row.text },
		])
	}

	return {
		...quiz,
		questions: picked.map((question) => ({
			id: question.id,
			prompt: question.prompt,
			image: question.image ?? undefined,
			category: quiz.category,
			choices: by_question.get(question.id) ?? [],
		})),
	}
}

export async function check_answer(db: Db, quiz_id: string, choice_id: string) {
	// Joined through to the quiz so a choice id from another quiz cannot be probed.
	const [chosen] = await db
		.select({ question_id: choices.question_id, is_correct: choices.is_correct })
		.from(choices)
		.innerJoin(questions, eq(choices.question_id, questions.id))
		.where(and(eq(choices.id, choice_id), eq(questions.quiz_id, quiz_id)))
		.limit(1)

	if (!chosen) return null

	const [question] = await db
		.select({ explanation: questions.explanation })
		.from(questions)
		.where(eq(questions.id, chosen.question_id))
		.limit(1)

	const [correct] = await db
		.select({ id: choices.id })
		.from(choices)
		.where(and(eq(choices.question_id, chosen.question_id), eq(choices.is_correct, true)))
		.limit(1)

	return {
		is_correct: chosen.is_correct,
		correct_choice_id: correct?.id ?? null,
		explanation: question?.explanation ?? null,
	}
}
