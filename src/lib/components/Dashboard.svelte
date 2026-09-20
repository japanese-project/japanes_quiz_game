<script lang="ts">
	import type { Level } from '$lib/types'
	import AppShell from './AppShell.svelte'
	import LevelCard from './LevelCard.svelte'

	let {
		username,
		totalScore,
		onStart,
		onLogout,
	}: {
		username: string
		totalScore: number
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
			color: 'var(--color-secondary)',
			tag: 'Recommended',
		},
		{
			level: 'N3',
			label: 'Intermediate Level',
			subtitle: 'Intermediate',
			description: 'Natural Japanese with longer sentences and more nuanced grammar.',
			color: 'var(--color-primary)',
			tag: 'Challenge',
		},
	]
</script>

<AppShell {username} active="quizzes" {onLogout}>
	<div class="mb-8 flex items-center justify-between gap-5 max-sm:mt-2 max-sm:mb-3 max-sm:shrink-0">
		<div>
			<h1 class="type-h1 font-black tracking-tight text-text-primary">Choose a level</h1>
		</div>
		<div class="flex items-center gap-3">
			<span
				class="type-caption hidden rounded-full border border-border bg-surface/30 px-5 py-2.5 font-bold text-text-secondary backdrop-blur-sm sm:inline-flex"
				>JLPT Practice</span
			>
		</div>
	</div>

	<section
		class="grid min-h-0 flex-1 grid-rows-[repeat(2,180px)] content-center gap-3 sm:hidden"
		aria-label="Choose a level"
	>
		{#each levels as item (item.level)}
			<LevelCard {...item} {onStart} />
		{/each}
	</section>

	<section class="hidden items-stretch gap-7 sm:grid md:grid-cols-2">
		{#each levels as item (item.level)}
			<LevelCard {...item} {onStart} />
		{/each}
	</section>

	<p class="type-caption mt-10 text-center text-text-secondary max-sm:hidden">
		Signed in as {username} · progress saved on this browser
	</p>
</AppShell>
