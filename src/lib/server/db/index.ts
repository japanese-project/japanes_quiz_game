import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'
import type { D1Database } from '@cloudflare/workers-types'

export interface Env {
	DB: D1Database
}

export const get_db = (env) => {
	if (!env.DB) {
		throw new Error('Database not found in environment variables')
	}

	return drizzle(env.DB, { schema })
}
