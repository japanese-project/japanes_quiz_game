<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import Dashboard from '$lib/components/Dashboard.svelte'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import { getSession, signOut } from '$lib/client/progress'
	import type { Level } from '$lib/types'

	let ready = $state(false)
	let username = $state('')

	onMount(() => {
		const session = getSession()
		if (!session.username) {
			void goto(resolve('/'), { replaceState: true })
			return
		}
		username = session.username
		ready = true
	})

	function logout() {
		signOut()
		void goto(resolve('/'))
	}

	function startQuiz(level: Level) {
		void goto(resolve('/quiz/[level]', { level: level.toLowerCase() }))
	}
</script>

<svelte:head><title>Dashboard | Japanese Quest</title></svelte:head>

{#if ready}
	<Dashboard {username} onStart={startQuiz} onLogout={logout} />
{:else}
	<LoadingScreen />
{/if}
