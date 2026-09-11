<script lang="ts">
	import type { Level } from '$lib/types'
	import AppShell from './AppShell.svelte'
	import LevelCard from './LevelCard.svelte'

	let {
		username,
		onStart,
		onLogout,
	}: {
		username: string
		onStart: (level: Level) => void
		onLogout: () => void
	} = $props()
	const levels: Array<{
		level: Level
		label: string
		subtitle: string
		description: string
		color: string
		tag: string
	}> = [
		{
			level: 'N4',
			label: 'Foundation Level',
			subtitle: 'Foundation',
			description: 'Essential vocabulary, kanji and grammar used in everyday situations.',
			color: '#08b3c0',
			tag: 'Recommended',
		},
		{
			level: 'N3',
			label: 'Intermediate Level',
			subtitle: 'Intermediate',
			description: 'Natural Japanese with longer sentences and more nuanced grammar.',
			color: '#e52f46',
			tag: 'Challenge',
		},
	]
</script>

<AppShell {username} active="quizzes" {onLogout}>
	<div class="mb-8 flex items-center justify-between gap-5">
		<div>
			<h1 class="text-2xl font-black tracking-tight text-white">Choose a level</h1>
			<p class="mt-2 text-sm text-blue-100/65">Each quiz contains 6 mixed questions</p>
		</div>
		<span
			class="hidden rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-blue-100/75 backdrop-blur-sm sm:inline-flex"
			>JLPT Practice</span
		>
	</div>

	<section class="grid items-stretch gap-7 lg:grid-cols-2">
		{#each levels as item (item.level)}
			<LevelCard {...item} {onStart} />
		{/each}
	</section>

	<p class="mt-10 text-center text-sm text-blue-100/60">
		Signed in as {username} · progress saved on this browser
	</p>
</AppShell>
