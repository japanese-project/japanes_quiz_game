import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// --- Users ---
export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull().unique(),
	// password: text('password').notNull() // optional
})

// --- Levels ---
export const levels = sqliteTable('levels', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
	sort_order: integer('sort_order').notNull(),
})

// --- Categories ---
export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(), // 'Vocabulary' | 'Grammar' | 'Kanji'
})

// --- Quizzes ---
export const quizzes = sqliteTable('quizzes', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	level_id: integer('level_id')
		.notNull()
		.references(() => levels.id),
	category_id: integer('category_id')
		.notNull()
		.references(() => categories.id),
	title: text('title').notNull(),
	description: text('description'),
})

// --- Questions ---
export const questions = sqliteTable('questions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	quiz_id: text('quiz_id')
		.notNull()
		.references(() => quizzes.id, { onDelete: 'cascade' }),
	prompt: text('prompt').notNull(),
	order_index: integer('order_index').notNull().default(0),
})

// --- Choices ---
export const choices = sqliteTable('choices', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	question_id: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	is_correct: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
})

// --- Quiz Attempts ---
export const quiz_attempts = sqliteTable('quiz_attempts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	quiz_id: text('quiz_id')
		.notNull()
		.references(() => quizzes.id, { onDelete: 'cascade' }),
	score: integer('score').notNull(),
	correct_count: integer('correct_count').notNull(),
	total_questions: integer('total_questions').notNull(),
	completed_at: integer('completed_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
})

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
})
