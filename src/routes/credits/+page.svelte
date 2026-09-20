<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import AppShell from '$lib/components/AppShell.svelte'
	import MemberCard from '$lib/components/MemberCard.svelte'
	import members from '$lib/data/team-members.json'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const sortedMembers = [...members].sort((a, b) => a.id - b.id)

	function getMemberImage(fileName: string) {
		return fileName ? `/images/${encodeURIComponent(fileName)}` : ''
	}

	function logout() {
		void fetch('/api/auth/logout', { method: 'POST' }).finally(() => goto(resolve('/')))
	}
</script>

<svelte:head>
	<title>Credits | Japanese Quest</title>
	<meta
		name="description"
		content="Meet the six-member team behind the Japanese Quest learning experience."
	/>
</svelte:head>

<AppShell username={data.user.username} active="credits" onLogout={logout}>
	<section class="mx-auto w-full max-w-6xl">
		<div class="mb-10 text-center">
			<span
				class="type-label inline-flex rounded-full border border-border bg-surface/30 px-4 py-2 font-black tracking-[0.2em] text-secondary-hover uppercase"
			>
				The team
			</span>
			<h1 class="type-h1 mt-5 font-black tracking-tight text-text-primary">
				Made with care by six creators
			</h1>
		</div>

		<div class="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each sortedMembers as member (member.id)}
				<MemberCard {...member} image={getMemberImage(member.image)} />
			{/each}
		</div>

		<p class="type-caption mt-10 text-center text-text-secondary">
			ありがとうございます · Thank you for learning with us
		</p>
	</section>
</AppShell>
