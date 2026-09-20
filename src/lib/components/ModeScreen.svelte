<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png'
	import type { QuizSummary } from '$lib/types'
	import { ROUND_MODES, round_size, type RoundMode } from '$lib/quiz_config'
	import Icon from './Icon.svelte'
	import Logo from './Logo.svelte'

	let {
		quiz,
		on_start,
		on_back,
	}: {
		quiz: QuizSummary
		on_start: (mode: RoundMode) => void
		on_back: () => void
	} = $props()
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat max-sm:h-dvh max-sm:min-h-0 max-sm:overflow-hidden"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<header class="border-b border-white/10 bg-[#061b35]/95">
		<div
			class="mx-auto flex min-h-24 max-w-[1280px] items-center justify-between gap-4 px-5 py-4 max-sm:min-h-0 max-sm:justify-start max-sm:px-4 max-sm:py-2.5 sm:px-8"
		>
			<div class="max-sm:hidden"><Logo light /></div>
			<button
				onclick={on_back}
				class="type-action flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 font-black text-blue-100/80 transition hover:bg-white/10 hover:text-white max-sm:border-0 max-sm:bg-transparent max-sm:px-0 max-sm:py-2 max-sm:text-white"
				><span class="hidden text-xl leading-none max-sm:inline" aria-hidden="true">←</span
				>Back</button
			>
		</div>
	</header>

	<div
		class="mx-auto w-full max-w-[900px] flex-1 px-5 py-10 max-sm:flex max-sm:min-h-0 max-sm:flex-col max-sm:overflow-hidden max-sm:px-4 max-sm:py-3 sm:px-8"
	>
		<p class="type-label font-black tracking-[0.22em] text-blue-200/70 uppercase">
			{quiz.level} · {quiz.category}
		</p>
		<h1 class="type-h1 mt-2 font-black text-blue-50 max-sm:mt-1">Choose a round length</h1>
		<p class="type-body mt-2 text-blue-100/70 max-sm:mt-1 max-sm:text-sm">
			{quiz.question_count} questions available. Each round is picked at random.
		</p>

		<div
			class="mt-8 grid gap-4 max-sm:mt-4 max-sm:min-h-0 max-sm:flex-1 max-sm:grid-rows-[repeat(3,104px)] max-sm:content-center max-sm:gap-3 sm:grid-cols-3"
		>
			{#each ROUND_MODES as mode (mode.id)}
				<button
					onclick={() => on_start(mode)}
					class="flex cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#0c2744]/65 p-6 text-left transition hover:border-white/25 hover:bg-[#0c2744] max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:grid-rows-[auto_auto] max-sm:items-center max-sm:p-4"
				>
					<span class="type-h3 font-black text-blue-50 max-sm:text-lg">{mode.label}</span>
					<span class="type-body mt-1 leading-6 text-blue-100/70 max-sm:text-sm max-sm:leading-5"
						>{mode.blurb}</span
					>
					<span
						class="type-caption mt-5 flex items-center gap-2 font-black text-blue-200/70 max-sm:col-start-2 max-sm:row-start-1 max-sm:row-end-3 max-sm:mt-0 max-sm:ml-3 max-sm:rounded-full max-sm:bg-cyan-300/10 max-sm:px-3 max-sm:py-2 max-sm:text-cyan-200"
					>
						{round_size(mode, quiz.question_count)} questions
						<Icon name="arrow" size={16} />
					</span>
				</button>
			{/each}
		</div>
	</div>
</main>
