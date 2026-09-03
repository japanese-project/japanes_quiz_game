import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

const USER_ID_COOKIE = 'user_id';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const load: PageServerLoad = ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	login: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim();

		if (!username) {
			return fail(400, { error: 'Please enter a username.' });
		}

		const db = getDb(platform!.env.DB);
		let existing = await db.query.user.findFirst({ where: eq(user.username, username) });

		if (!existing) {
			[existing] = await db.insert(user).values({ username }).returning();
		}

		cookies.set(USER_ID_COOKIE, existing.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: ONE_YEAR_IN_SECONDS
		});

		return redirect(303, '/');
	},

	logout: async ({ cookies }) => {
		cookies.delete(USER_ID_COOKIE, { path: '/' });
		return redirect(303, '/');
	}
};
