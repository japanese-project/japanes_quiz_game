export type Level = 'N4' | 'N3'
export type QuizCategory = 'Vocabulary' | 'Kanji' | 'Grammar'

export type QuizSummary = {
	id: string
	title: string
	description: string | null
	level: Level
	category: QuizCategory
	question_count: number
}

export type Choice = {
	id: string
	text: string
}

/** Note the absence of a correct answer or explanation: both come back from
 *  submit_answer instead, so neither is ever sent to the browser up front. */
export type Question = {
	id: string
	prompt: string
	category: QuizCategory
	image?: string
	choices: Choice[]
}

export type Quiz = {
	id: string
	title: string
	level: Level
	category: QuizCategory
	questions: Question[]
}

export type AnswerResult = {
	is_correct: boolean
	correct_choice_id: string | null
	explanation: string | null
}

export type LevelProgress = {
	score: number
	answered: number
	best: number
}

export type UserProgress = Record<Level, LevelProgress>;
