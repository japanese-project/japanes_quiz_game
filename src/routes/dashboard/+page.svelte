<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import Dashboard from '$lib/components/Dashboard.svelte'
	import type { Level } from '$lib/types'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
		void goto(resolve('/'))
	}

	function startQuiz(level: Level) {
		void goto(resolve('/quiz/[level]', { level: level.toLowerCase() }))
	}
</script>

<svelte:head><title>Dashboard | Japanese Quest</title></svelte:head>

{#if data.user}
	<Dashboard username={data.user.username} onStart={startQuiz} onLogout={logout} />
{/if}
