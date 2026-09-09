import 'dotenv/config'
import { drizzle } from '@nerdfolio/drizzle-d1-proxy'
import type { D1Credentials } from '@nerdfolio/drizzle-d1-proxy'
import { faker } from '@faker-js/faker'

import {
	levels,
	categories,
	users,
	quizzes,
	questions,
	choices,
	quiz_attempts,
} from '../src/lib/server/db/schema.ts'

const creds: D1Credentials = {
	accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
	databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
	token: process.env.CLOUDFLARE_D1_TOKEN!,
}

const db = drizzle(creds)

async function main() {
	console.log('🚀 Starting seed process...')

	// --- CLEANUP ---
	console.log('🧹 Cleaning up old data...')
	await db.delete(choices)
	await db.delete(questions)
	await db.delete(quiz_attempts)
	await db.delete(quizzes)
	await db.delete(users)
	await db.delete(categories)
	await db.delete(levels)

	// --- LEVELS ---
	console.log('📚 Seeding levels (N4 to N3)...')
	const level_data = [
		{ name: 'N4', sort_order: 4 },
		{ name: 'N3', sort_order: 3 },
	]

	const inserted_levels = await db.insert(levels).values(level_data).returning({ id: levels.id })

	// --- CATEGORIES ---
	console.log('📂 Seeding categories...')
	const category_data = ['Vocabulary', 'Grammar', 'Kanji', 'Listening'].map((name) => ({ name }))
	const inserted_categories = await db
		.insert(categories)
		.values(category_data)
		.returning({ id: categories.id })

	// --- USERS ---
	console.log('👤 Seeding users...')
	const user_data = Array.from({ length: 10 }).map(() => ({
		username: faker.internet.username(),
	}))
	const inserted_users = await db.insert(users).values(user_data).returning({ id: users.id })

	// --- QUIZZES ---
	console.log('📝 Seeding quizzes...')
	const quiz_data = Array.from({ length: 5 }).map(() => ({
		title: faker.lorem.words(3),
		category_id: faker.helpers.arrayElement(inserted_categories).id,
		level_id: faker.helpers.arrayElement(inserted_levels).id,
	}))

	const inserted_quizzes = await db.insert(quizzes).values(quiz_data).returning()

	// --- QUESTIONS & CHOICES ---
	console.log('❓ Seeding questions and choices...')
	for (const quiz of inserted_quizzes) {
		const questions_data = Array.from({ length: 3 }).map(() => ({
			quiz_id: quiz.id,
			prompt: faker.lorem.sentence(),
		}))
		const inserted_questions = await db.insert(questions).values(questions_data).returning()

		for (const question of inserted_questions) {
			const choices_data = Array.from({ length: 4 }).map((_, i) => ({
				question_id: question.id,
				text: faker.lorem.word(),
				is_correct: i === 0, // first choice correct
			}))
			await db.insert(choices).values(choices_data)
		}
	}

	// --- QUIZ ATTEMPTS ---
	console.log('📈 Seeding quiz attempts...')
	const attempt_data = Array.from({ length: 20 }).map(() => {
		const correct_count = faker.number.int({ min: 0, max: 3 })

		return {
			user_id: faker.helpers.arrayElement(inserted_users).id,
			quiz_id: faker.helpers.arrayElement(inserted_quizzes).id,
			score: Math.round((correct_count / 3) * 100),
			correct_count,
			total_questions: 3,
			completed_at: faker.date.recent({ days: 30 }),
		}
	})
	for (const attempt of attempt_data) {
		await db.insert(quiz_attempts).values(attempt)
	}

	console.log('✅ Seed complete!')
}

main().catch((err) => {
	console.error('❌ Seed failed!', err)
	process.exit(1)
})
