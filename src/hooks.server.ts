import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	const userId = event.cookies.get('user_id');

	if (userId) {
		const db = getDb(event.platform!.env.DB);
		const found = await db.query.user.findFirst({ where: eq(user.id, userId) });
		event.locals.user = found ?? null;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
