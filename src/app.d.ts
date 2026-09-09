// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env
			ctx: ExecutionContext
			caches: CacheStorage
			cf?: IncomingRequestCfProperties
		}

		// interface Error {}
		interface Locals {
			user: { id: string; username: string } | null
			session: { id: string; expiresAt: Date } | null
		}
		// interface PageData {}
		// interface PageState {}
	}

	interface Env {
		IMPORT_TOKEN?: string
	}
}

export {}
