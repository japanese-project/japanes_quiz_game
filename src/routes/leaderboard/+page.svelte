<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import AppShell from '$lib/components/AppShell.svelte'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import RankingBoard from '$lib/components/RankingBoard.svelte'
	import { watchLeaderboard } from './leaderboard.remote'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let requestedPage = $state(1)
	let leaderboard = $derived(watchLeaderboard(requestedPage))

	function logout() {
		void fetch('/api/auth/logout', { method: 'POST' }).finally(() => goto(resolve('/')))
	}
</script>

<svelte:head><title>Leaderboard | Japanese Quest</title></svelte:head>

{#if leaderboard.loading}
	<LoadingScreen />
{:else if leaderboard.error}
	<main class="grid min-h-screen place-items-center bg-[#071e3b] px-5 text-center text-blue-50">
		<div>
			<h1 class="text-2xl font-black">Leaderboard unavailable</h1>
			<p class="mt-2 text-sm text-blue-100/65">Please check your connection and try again.</p>
			<button
				onclick={() => leaderboard.reconnect()}
				class="mt-6 cursor-pointer rounded-full bg-[#e52f46] px-5 py-3 text-sm font-bold text-white"
				>Reconnect</button
			>
		</div>
	</main>
{:else if leaderboard.current}
	<AppShell username={data.user.username} active="leaderboard" onLogout={logout}>
		<div class="mb-4 flex justify-end">
			<span
				class="rounded-full px-3 py-1 text-xs font-bold {leaderboard.connected
					? 'bg-emerald-400/10 text-emerald-300'
					: 'bg-amber-300/10 text-amber-300'}"
				>{leaderboard.connected ? 'Live' : 'Reconnecting…'}</span
			>
		</div>
		<RankingBoard
			rankings={leaderboard.current.items}
			currentUser={data.user.username}
			page={leaderboard.current.page}
			total={leaderboard.current.total}
			totalPages={leaderboard.current.totalPages}
			hasPrevious={leaderboard.current.hasPrevious}
			hasNext={leaderboard.current.hasNext}
			onPrevious={() => (requestedPage = leaderboard.current!.page - 1)}
			onNext={() => (requestedPage = leaderboard.current!.page + 1)}
		/>
	</AppShell>
{:else}
	<LoadingScreen />
{/if}
