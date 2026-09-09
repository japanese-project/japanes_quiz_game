<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import AppShell from '$lib/components/AppShell.svelte'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import RankingBoard from '$lib/components/RankingBoard.svelte'
	import { getRankings, getSession, signOut, type Ranking } from '$lib/client/progress'

	let ready = $state(false)
	let username = $state('')
	let rankings = $state<Ranking[]>([])

	onMount(() => {
		const session = getSession()
		if (!session.username) {
			void goto(resolve('/'), { replaceState: true })
			return
		}
		username = session.username
		rankings = getRankings(session.profiles)
		ready = true
	})

	function logout() {
		signOut()
		void goto(resolve('/'))
	}
</script>

<svelte:head><title>Leaderboard | Japanese Quest</title></svelte:head>

{#if ready}
	<AppShell {username} active="leaderboard" onLogout={logout}>
		<RankingBoard {rankings} currentUser={username} />
	</AppShell>
{:else}
	<LoadingScreen />
{/if}
