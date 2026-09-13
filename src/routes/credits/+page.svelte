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
				class="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-black tracking-[0.2em] text-[#67e8f9] uppercase"
			>
				The team
			</span>
			<h1 class="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
				Made with care by six creators
			</h1>
			<p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100/65 sm:text-base">
				Meet the people who combined design, development, content, and testing to build Japanese
				Quest.
			</p>
		</div>

		<div class="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each sortedMembers as member (member.id)}
				<MemberCard {...member} image={getMemberImage(member.image)} />
			{/each}
		</div>

		<p class="mt-10 text-center text-sm text-blue-100/50">
			ありがとうございます · Thank you for learning with us
		</p>
	</section>
</AppShell>
