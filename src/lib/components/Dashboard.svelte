<script lang="ts">
	import { formatScore } from '$lib/scoring'
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
	let selectedLevel = $state<Level>('N4')
	let selectedItem = $derived(levels.find((item) => item.level === selectedLevel) ?? levels[0])
</script>

<AppShell {username} active="quizzes" {onLogout}>
	<div class="mb-8 flex items-center justify-between gap-5 max-sm:mb-3 max-sm:shrink-0">
		<div>
			<h1 class="type-h1 font-black tracking-tight text-white">Choose a level</h1>
			<p class="type-body mt-2 text-blue-100/65">Pick a level, then choose a category</p>
		</div>
		<div class="flex items-center gap-3">
			<span
				class="type-caption rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 font-black text-cyan-200"
				>Total {formatScore(totalScore)}</span
			>
			<span
				class="type-caption hidden rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-bold text-blue-100/75 backdrop-blur-sm sm:inline-flex"
				>JLPT Practice</span
			>
		</div>
	</div>

	<div class="mb-3 grid shrink-0 grid-cols-2 gap-2 sm:hidden" aria-label="Choose a level">
		{#each levels as item (item.level)}
			<button
				type="button"
				onclick={() => (selectedLevel = item.level)}
				aria-pressed={selectedLevel === item.level}
				class="type-action cursor-pointer rounded-xl border px-4 py-2.5 font-black transition {selectedLevel ===
				item.level
					? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
					: 'border-white/10 bg-white/[0.03] text-blue-100/60'}"
			>
				{item.level}
			</button>
		{/each}
	</div>

	<div class="min-h-0 flex-1 sm:hidden">
		<LevelCard {...selectedItem} {onStart} />
	</div>

	<section class="hidden items-stretch gap-7 sm:grid lg:grid-cols-2">
		{#each levels as item (item.level)}
			<LevelCard {...item} {onStart} />
		{/each}
	</section>

	<p class="type-caption mt-10 text-center text-blue-100/60 max-sm:hidden">
		Signed in as {username} · progress saved on this browser
	</p>
</AppShell>
