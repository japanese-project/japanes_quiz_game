<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png'
	import type { Level, QuizSummary } from '$lib/types'
	import Icon from './Icon.svelte'
	import Logo from './Logo.svelte'

	let {
		level,
		quizzes,
		on_select,
		on_back,
	}: {
		level: Level
		quizzes: QuizSummary[]
		on_select: (quiz: QuizSummary) => void
		on_back: () => void
	} = $props()

	const accents: Record<string, string> = {
		Vocabulary: '#08b3c0',
		Kanji: '#e52f46',
		Grammar: '#f0a23b',
	}

	const blurbs: Record<string, string> = {
		Vocabulary: 'Everyday words and their meanings.',
		Kanji: 'Readings of common characters.',
		Grammar: 'Particles and sentence patterns.',
	}
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<header class="border-b border-white/10 bg-[#061b35]/95">
		<div
			class="mx-auto flex min-h-24 max-w-[1280px] items-center justify-between gap-4 px-5 py-4 sm:px-8"
		>
			<Logo light />
			<button
				onclick={on_back}
				class="type-action flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 font-black text-blue-100/80 transition hover:bg-white/10 hover:text-white"
				>Back</button
			>
		</div>
	</header>

	<div class="mx-auto w-full max-w-[1280px] flex-1 px-5 py-10 sm:px-8">
		<p class="type-label font-black tracking-[0.22em] text-blue-200/70 uppercase">{level} level</p>
		<h1 class="type-h1 mt-2 font-black text-blue-50">Choose a category</h1>
		<p class="type-body mt-2 text-blue-100/70">
			Pick a category, then choose how long a round runs.
		</p>

		{#if quizzes.length === 0}
			<p class="type-body mt-10 font-bold text-blue-100/70">
				No quizzes have been added for {level} yet.
			</p>
		{:else}
			<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each quizzes as quiz (quiz.id)}
					<button
						onclick={() => on_select(quiz)}
						disabled={quiz.question_count === 0}
						class="flex cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#0c2744]/65 p-6 text-left transition hover:border-white/25 hover:bg-[#0c2744] disabled:cursor-not-allowed disabled:opacity-50"
					>
						<span
							class="type-label inline-flex w-fit rounded-full px-3 py-1 font-black text-white"
							style={`background-color: ${accents[quiz.category] ?? '#08b3c0'}`}
							>{quiz.category}</span
						>
						<span class="type-h3 mt-4 font-black text-blue-50">{quiz.title}</span>
						<span class="type-body mt-1 leading-6 text-blue-100/70"
							>{blurbs[quiz.category] ?? ''}</span
						>
						<span class="type-caption mt-5 flex items-center gap-2 font-black text-blue-200/70">
							{quiz.question_count} questions available
							<Icon name="arrow" size={16} />
						</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</main>
