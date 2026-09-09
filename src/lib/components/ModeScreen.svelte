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
				class="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black text-blue-100/80 transition hover:bg-white/10 hover:text-white"
				>Back</button
			>
		</div>
	</header>

	<div class="mx-auto w-full max-w-[900px] flex-1 px-5 py-10 sm:px-8">
		<p class="text-xs font-black tracking-[0.22em] text-blue-200/70 uppercase">
			{quiz.level} · {quiz.category}
		</p>
		<h1 class="mt-2 text-2xl font-black text-blue-50 sm:text-3xl">Choose a round length</h1>
		<p class="mt-2 text-sm text-blue-100/70">
			{quiz.question_count} questions available. Each round is picked at random.
		</p>

		<div class="mt-8 grid gap-4 sm:grid-cols-3">
			{#each ROUND_MODES as mode (mode.id)}
				<button
					onclick={() => on_start(mode)}
					class="flex cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#0c2744]/65 p-6 text-left transition hover:border-white/25 hover:bg-[#0c2744]"
				>
					<span class="text-lg font-black text-blue-50">{mode.label}</span>
					<span class="mt-1 text-sm leading-6 text-blue-100/70">{mode.blurb}</span>
					<span class="mt-5 flex items-center gap-2 text-xs font-black text-blue-200/70">
						{round_size(mode, quiz.question_count)} questions
						<Icon name="arrow" size={16} />
					</span>
				</button>
			{/each}
		</div>
	</div>
</main>
