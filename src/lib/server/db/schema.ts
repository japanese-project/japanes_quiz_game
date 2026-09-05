import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull().unique(),
	// uncomment the below line if you want to add password field
	//   password: text('password').notNull()
})

export const level = sqliteTable('level', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
	sortOrder: integer('sort_order').notNull(),
})

export const category = sqliteTable('category', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 'Vocabulary' | 'Grammar' | 'Kanji'
})

export const quiz = sqliteTable('quiz', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	levelId: integer('level_id')
		.notNull()
		.references(() => level.id),
	categoryId: integer('category_id')
		.notNull()
		.references(() => category.id),
	title: text('title').notNull(),
	description: text('description'),
})

export const question = sqliteTable('question', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quiz.id, { onDelete: 'cascade' }),
	prompt: text('prompt').notNull(),
	orderIndex: integer('order_index').notNull().default(0),
})

export const choice = sqliteTable('choice', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	questionId: text('question_id')
		.notNull()
		.references(() => question.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
})

export const quizAttempt = sqliteTable('quiz_attempt', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quiz.id, { onDelete: 'cascade' }),
	score: integer('score').notNull(),
	correctCount: integer('correct_count').notNull(),
	totalQuestions: integer('total_questions').notNull(),
	completedAt: integer('completed_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
})
