import { users } from "$lib/server/db/schema"
import { get_db } from "$lib/server/db"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ platform }) => {
    const db = get_db(platform?.env)

    const ranks = await db.select().from(users);

    console.log("ranks", ranks)
    return json("hello")
}