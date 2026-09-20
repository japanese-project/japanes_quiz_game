<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoginScreen from '$lib/components/LoginScreen.svelte'
	import { playThemeMusic, stopAllAudio } from '$lib/client/audio'
	import { signIn } from '$lib/client/progress'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	// If already logged in (server says so), redirect immediately.
	$effect(() => {
		if (data.user) {
			void goto(resolve('/dashboard'), { replaceState: true })
		}
	})

	async function login(username: string, avatarId: string): Promise<string | null> {
		// Start during the submit gesture so browser autoplay policies allow music after login.
		playThemeMusic()
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username }),
			})
			if (!res.ok) {
				stopAllAudio()
				const text = await res.text()
				return text || 'Could not sign in. Please try again.'
			}
			// Keep localStorage in sync so other pages that read it still work.
			signIn(username, avatarId)
			void goto(resolve('/dashboard'))
			return null
		} catch {
			stopAllAudio()
			return 'Network error. Please check your connection and try again.'
		}
	}
</script>

<svelte:head>
	<title>Sign in | Japanese Quest</title>
	<meta
		name="description"
		content="Practice JLPT N4 and N3 vocabulary, kanji, and grammar with interactive Japanese quizzes."
	/>
</svelte:head>

{#if !data.user}
	<LoginScreen onLogin={login} />
{/if}
