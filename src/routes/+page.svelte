<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoginScreen from '$lib/components/LoginScreen.svelte'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import { getSession, signIn } from '$lib/client/progress'

	let ready = $state(false)

	onMount(() => {
		if (getSession().username) {
			void goto(resolve('/dashboard'), { replaceState: true })
			return
		}
		ready = true
	})

	function login(username: string) {
		signIn(username)
		void goto(resolve('/dashboard'))
	}
</script>

<svelte:head>
	<title>Sign in | Japanese Quest</title>
	<meta
		name="description"
		content="Practice JLPT N4 and N3 vocabulary, kanji, and grammar with interactive Japanese quizzes."
	/>
</svelte:head>

{#if ready}
	<LoginScreen onLogin={login} />
{:else}
	<LoadingScreen />
{/if}
