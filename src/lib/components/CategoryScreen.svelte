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
		Vocabulary: 'var(--color-secondary)',
		Kanji: 'var(--color-primary)',
		Grammar: 'var(--color-warning)',
	}

	const blurbs: Record<string, string> = {
		Vocabulary: 'Everyday words and their meanings.',
		Kanji: 'Readings of common characters.',
		Grammar: 'Particles and sentence patterns.',
	}

	const japaneseLabels: Record<string, string> = {
		Vocabulary: '単語',
		Kanji: '漢字',
		Grammar: '文法',
	}

	const mobileTitles: Record<string, string> = {
		Vocabulary: 'Vocab',
		Kanji: 'Kanji',
		Grammar: 'Grammar',
	}
</script>

<main
	class="app-pattern-bg flex min-h-screen flex-col overflow-x-hidden bg-cover bg-fixed bg-center bg-no-repeat max-sm:h-dvh max-sm:min-h-0 max-sm:overflow-hidden"
	style={`--pattern-image:url('${patternBackground}')`}
>
	<header class="border-b border-border/50 bg-bg-deep/95">
		<div
			class="mx-auto flex min-h-24 max-w-[1280px] items-center justify-between gap-4 px-5 py-4 max-sm:min-h-0 max-sm:justify-start max-sm:px-4 max-sm:py-2.5 sm:px-8"
		>
			<div class="max-sm:hidden"><Logo light /></div>
			<button
				onclick={on_back}
				class="type-action flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/20 px-5 py-3 font-black text-text-secondary transition hover:bg-surface-hover/60 hover:text-text-primary max-sm:border-0 max-sm:bg-transparent max-sm:px-0 max-sm:py-2 max-sm:text-text-primary"
				><span class="hidden text-xl leading-none max-sm:inline" aria-hidden="true">←</span
				>Back</button
			>
		</div>
	</header>

	<div
		class="mx-auto w-full max-w-[1280px] flex-1 px-5 py-10 max-sm:flex max-sm:min-h-0 max-sm:flex-col max-sm:overflow-hidden max-sm:px-4 max-sm:py-3 sm:px-8"
	>
		<p class="type-label font-black tracking-[0.22em] text-text-secondary uppercase">
			{level} level
		</p>
		<h1 class="type-h1 mt-2 font-black text-text-primary max-sm:mt-1">Choose a category</h1>
		<p class="type-body mt-2 text-text-secondary max-sm:mt-1">
			Pick a category, then choose how long a round runs.
		</p>

		{#if quizzes.length === 0}
			<p class="type-body mt-10 font-bold text-text-secondary">
				No quizzes have been added for {level} yet.
			</p>
		{:else}
			<div
				class="mt-8 grid gap-5 max-sm:mt-4 max-sm:min-h-0 max-sm:flex-1 max-sm:grid-cols-2 max-sm:grid-rows-[repeat(2,170px)] max-sm:content-center max-sm:gap-3 sm:grid-cols-2 lg:grid-cols-3"
			>
				{#each quizzes as quiz, index (quiz.id)}
					<button
						onclick={() => on_select(quiz)}
						disabled={quiz.question_count === 0}
						class="category-card relative flex cursor-pointer flex-col rounded-2xl border border-border bg-surface/65 p-6 text-left transition hover:border-secondary/60 hover:bg-surface-hover disabled:cursor-not-allowed disabled:border-disabled disabled:opacity-50 max-sm:items-center max-sm:justify-center max-sm:rounded-[18px] max-sm:bg-surface max-sm:px-2 max-sm:py-4 max-sm:text-center max-sm:hover:border-secondary/60 max-sm:hover:bg-surface-hover {quizzes.length %
							2 ===
							1 && index === quizzes.length - 1
							? 'max-sm:col-span-2 max-sm:w-[calc(50%_-_0.375rem)] max-sm:justify-self-center'
							: ''}"
					>
						<span
							class="hidden font-black max-sm:mb-4 max-sm:grid max-sm:size-12 max-sm:place-items-center max-sm:rounded-full max-sm:text-lg"
							style={`background-color:color-mix(in srgb, ${accents[quiz.category] ?? 'var(--color-secondary)'} 13%, transparent);color:${accents[quiz.category] ?? 'var(--color-secondary)'}`}
							>{japaneseLabels[quiz.category] ?? '学'}</span
						>
						<span
							class="type-label inline-flex w-fit rounded-full px-3 py-1 font-black text-text-primary max-sm:hidden"
							style={`background-color:${accents[quiz.category] ?? 'var(--color-secondary)'}`}
							>{quiz.category}</span
						>
						<span class="type-h3 mt-4 font-black text-text-primary max-sm:hidden">{quiz.title}</span
						>
						<span class="hidden text-base font-black text-text-primary max-sm:block"
							>{mobileTitles[quiz.category] ?? quiz.category}</span
						>
						<span class="type-body mt-1 leading-6 text-text-secondary max-sm:hidden"
							>{blurbs[quiz.category] ?? ''}</span
						>
						<span
							class="type-caption mt-5 flex items-center gap-2 font-black text-text-secondary max-sm:hidden"
						>
							{quiz.question_count} questions available
							<Icon name="arrow" size={16} />
						</span>
						<span
							class="absolute right-3 bottom-3 left-3 hidden h-1 rounded-full max-sm:block"
							style={`background-color:${accents[quiz.category] ?? 'var(--color-secondary)'}`}
						></span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	@media (max-width: 639px) {
		.category-card {
			box-shadow:
				0 12px 24px color-mix(in srgb, var(--color-bg-deep) 70%, transparent),
				0 6px 0 color-mix(in srgb, var(--color-border) 65%, transparent);
		}

		.category-card:active:not(:disabled) {
			transform: translateY(3px);
			box-shadow:
				0 6px 14px color-mix(in srgb, var(--color-bg-deep) 65%, transparent),
				0 3px 0 color-mix(in srgb, var(--color-border) 65%, transparent);
		}
	}
</style>
