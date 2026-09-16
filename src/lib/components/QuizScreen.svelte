<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png'
	import type { AnswerResult, Level, Quiz } from '$lib/types'
	import { submit_answer } from '$lib/api/quizzes'
	import AnswerOption from './AnswerOption.svelte'

	let {
		level,
		quiz,
		on_finish,
		on_exit,
	}: {
		level: Level
		quiz: Quiz
		on_finish: (score: number, correct: number) => void
		on_exit: () => void
	} = $props()

	// Track each question's answered state so Back can restore it
	type QuestionState = {
		selected_choice_id: string
		result: AnswerResult
		counted: boolean // whether correct_count was incremented for this question
	}
	let answered = $state<Map<number, QuestionState>>(new Map())

	let index = $state(0)
	let selected_choice_id = $state<string | null>(null)
	let result = $state<AnswerResult | null>(null)
	let checking = $state(false)
	let error = $state('')
	let correct_count = $state(0)

	let current = $derived(quiz.questions[index])
	let is_last = $derived(index === quiz.questions.length - 1)
	let progress = $derived(Math.round(((index + (result ? 1 : 0)) / quiz.questions.length) * 100))

	async function select_answer(choice_id: string) {
		if (result || checking) return
		selected_choice_id = choice_id
		checking = true
		error = ''

		try {
			// The server decides: the answer never reaches the browser before this call.
			result = await submit_answer(quiz.id, choice_id)
		} catch (thrown) {
			// An unchecked answer is not a wrong one: let the player pick again rather than
			// cost them the point for a network failure.
			selected_choice_id = null
			error = thrown instanceof Error ? thrown.message : 'Could not check that answer.'
			return
		} finally {
			checking = false
		}

		const counted = result.is_correct
		if (counted) correct_count += 1

		// Persist answered state for this question index
		answered.set(index, { selected_choice_id: choice_id, result, counted })
		answered = new Map(answered) // trigger reactivity
	}

	function go_next() {
		if (is_last) {
			on_finish(correct_count * 10, correct_count)
			return
		}
		index += 1
		// Restore saved state if this question was already answered
		const saved = answered.get(index)
		if (saved) {
			selected_choice_id = saved.selected_choice_id
			result = saved.result
		} else {
			selected_choice_id = null
			result = null
		}
		error = ''
	}

	function go_back() {
		if (index === 0) return
		// If current question was answered and counted, undo the count before leaving
		const current_saved = answered.get(index)
		// (no need to undo — we re-derive correct_count from the map on demand)
		index -= 1
		const saved = answered.get(index)
		if (saved) {
			selected_choice_id = saved.selected_choice_id
			result = saved.result
		} else {
			selected_choice_id = null
			result = null
		}
		error = ''
	}
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<div class="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
		<button
			onclick={on_exit}
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
				{#each current.choices as choice, choice_index (choice.id)}
					<AnswerOption
						{choice}
						index={choice_index}
						selected={selected_choice_id}
						correct_choice_id={result?.correct_choice_id ?? null}
						submitted={!!result}
						{checking}
						onSelect={select_answer}
					/>
				{/each}
			</div>

			{#if checking}
				<div class="mt-6 flex items-center gap-2 text-sm font-bold text-blue-100/50">
					<span
						class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					></span>
					Checking…
				</div>
			{:else if error}
				<p
					class="mt-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm font-bold text-red-200"
				>
					{error}
				</p>
			{:else if result}
				<div
					class="mt-6 rounded-xl border p-4 {result.is_correct
						? 'border-emerald-400/40 bg-emerald-400/10'
						: 'border-amber-300/40 bg-amber-300/10'}"
				>
					<p class="text-sm font-black {result.is_correct ? 'text-emerald-300' : 'text-amber-300'}">
						{result.is_correct ? 'Correct!' : 'Not quite. Review the correct answer.'}
					</p>
					{#if result.explanation}
						<p class="mt-1 text-sm leading-6 text-blue-100/70">{result.explanation}</p>
					{/if}
				</div>
			{/if}

			<!-- Back / Next navigation -->
			<div class="mt-auto flex items-center justify-between pt-8">
				<button
					onclick={go_back}
					disabled={index === 0}
					class="cursor-pointer rounded-full px-6 py-3 text-sm font-bold transition
						{index === 0
						? 'pointer-events-none text-blue-100/20'
						: 'bg-white/10 text-white hover:bg-white/20'}"
				>
					← Back
				</button>

				{#if result}
					<button
						onclick={go_next}
						class="cursor-pointer rounded-full bg-[#2ed573] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#2ecc71]"
					>
						{is_last ? 'Finish →' : 'Next →'}
					</button>
				{:else}
					<div class="h-12"></div>
				{/if}
			</div>
		</div>
	</section>
</main>
