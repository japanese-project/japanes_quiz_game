<script lang="ts">
	import { onDestroy } from 'svelte'
	import patternBackground from '$lib/assets/pattern1.png'
	import type { AnswerResult, Level, Quiz } from '$lib/types'
	import { submit_answer } from '$lib/api/quizzes'
	import AnswerOption from './AnswerOption.svelte'

	let {
		level,
		quiz,
		onFinish,
		onExit,
	}: {
		level: Level
		quiz: Quiz
		onFinish: (score: number, correct: number) => void
		onExit: () => void
	} = $props()

	let index = $state(0)
	let selected = $state<string | null>(null)   // selected choice id
	let result = $state<AnswerResult | null>(null) // from API after submitting
	let checking = $state(false)                   // waiting for API response
	let correctCount = $state(0)
	let advanceTimer: ReturnType<typeof setTimeout> | undefined

	let current = $derived(quiz.questions[index])
	let progress = $derived(Math.round(((index + (result ? 1 : 0)) / quiz.questions.length) * 100))

	async function selectAnswer(choice_id: string) {
		if (result || checking) return
		selected = choice_id
		checking = true
		try {
			result = await submit_answer(quiz.id, choice_id)
			if (result.is_correct) correctCount += 1
		} catch {
			// If the API call fails, treat the answer as wrong and continue
			result = { is_correct: false, correct_choice_id: null, explanation: null }
		}
		checking = false
		advanceTimer = setTimeout(next, 1500)
	}

	function next() {
		if (index === quiz.questions.length - 1) {
			onFinish(correctCount * 10, correctCount)
			return
		}
		index += 1
		selected = null
		result = null
	}

	onDestroy(() => {
		if (advanceTimer) clearTimeout(advanceTimer)
	})
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<div class="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
		<button
			onclick={onExit}
			class="cursor-pointer text-sm font-bold text-blue-100/70 transition hover:text-white"
			>← Dashboard</button
		>
		<div class="flex items-center gap-3">
			<span class="rounded-full bg-[#e52f46] px-3 py-1.5 text-xs font-black text-white"
				>{level}</span
			><span class="text-sm font-bold text-blue-100/70"
				>Question {index + 1} / {quiz.questions.length}</span
			>
		</div>
	</div>
	<div class="h-1.5 w-full overflow-hidden bg-white/10">
		<div class="h-full bg-[#e52f46] transition-all duration-500" style={`width:${progress}%`}></div>
	</div>

	<section
		class="flex flex-1 flex-col border-y border-white/10 bg-gradient-to-b from-[#1a3555]/90 to-[#102b49]/90 shadow-2xl shadow-black/20"
	>
		<div class="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
			<div>
				<span class="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300"
					>{current.category}</span
				>
			</div>
			{#if current.image}<div
					class="mt-6 mb-7 grid h-32 place-items-center rounded-2xl border border-white/10 bg-[#0c2744]/65 text-6xl"
					role="img"
					aria-label="Question illustration"
				>
					{current.image}
				</div>{/if}
			<h1 class="mt-7 text-lg leading-8 font-black text-blue-50 sm:text-xl">{current.prompt}</h1>
			<div class="mt-7 grid gap-3 sm:grid-cols-2">
				{#each current.choices as choice, choiceIndex (choice.id)}
					<AnswerOption
						{choice}
						index={choiceIndex}
						selected={selected}
						correct_choice_id={result?.correct_choice_id ?? null}
						submitted={!!result}
						{checking}
						onSelect={selectAnswer}
					/>
				{/each}
			</div>

			{#if checking}
				<div class="mt-6 flex items-center gap-2 text-sm font-bold text-blue-100/50">
					<span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
					Checking…
				</div>
			{:else if result}
				<div
					class="mt-6 rounded-xl border p-4 {result.is_correct
						? 'border-emerald-400/40 bg-emerald-400/10'
						: 'border-amber-300/40 bg-amber-300/10'}"
				>
					<p
						class="text-sm font-black {result.is_correct ? 'text-emerald-300' : 'text-amber-300'}"
					>
						{result.is_correct ? 'Correct!' : 'Not quite. Review the correct answer.'}
					</p>
					{#if result.explanation}
						<p class="mt-1 text-sm leading-6 text-blue-100/70">{result.explanation}</p>
					{/if}
				</div>
			{/if}

			<div class="mt-auto min-h-8 pt-8 text-right text-xs font-bold text-blue-100/45">
				{#if result}Continuing automatically…{/if}
			</div>
		</div>
	</section>
</main>
