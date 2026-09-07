import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { get_db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	const userId = event.cookies.get('user_id');

	if (userId) {
		const db = get_db(event.platform!.env);
		const found = await db.query.users.findFirst({ where: eq(users.id, userId) });
		event.locals.user = found ?? null;
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
