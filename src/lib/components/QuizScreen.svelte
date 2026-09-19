<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import patternBackground from '$lib/assets/pattern1.png'
	import type { AnswerResult, Level, Quiz } from '$lib/types'
	import { submit_answer } from '$lib/api/quizzes'
	import { playAnswerSound, playQuizMusic, playThemeMusic } from '$lib/client/audio'
	import { calculateScore, formatScore, QUESTION_TIME_SECONDS } from '$lib/scoring'
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

	let index = $state(0)
	let selected_choice_id = $state<string | null>(null)
	let result = $state<AnswerResult | null>(null)
	let checking = $state(false)
	let error = $state('')
	let correct_count = $state(0)
	let score_hundredths = $state(0)
	let points_earned = $state(0)
	let advance_timeout: ReturnType<typeof setTimeout> | undefined
	let question_timer: ReturnType<typeof setInterval> | undefined
	const scored_question_ids = new Set<string>()
	const ANSWER_FEEDBACK_MS = 3000

	let seconds_left = $state(QUESTION_TIME_SECONDS)

	let current = $derived(quiz.questions[index])
	let is_last = $derived(index === quiz.questions.length - 1)
	let score = $derived(score_hundredths / 100)
	let timer_progress = $derived((seconds_left / QUESTION_TIME_SECONDS) * 100)

	function stop_question_timer() {
		clearInterval(question_timer)
		question_timer = undefined
	}

	function start_question_timer(from = QUESTION_TIME_SECONDS) {
		stop_question_timer()
		seconds_left = from
		question_timer = setInterval(() => {
			seconds_left -= 1
			if (seconds_left <= 0) {
				stop_question_timer()
				go_next()
			}
		}, 1000)
	}

	async function select_answer(choice_id: string) {
		if (result || checking) return
		stop_question_timer()
		const submitted_with_seconds_left = seconds_left
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
			start_question_timer(Math.max(seconds_left, 1))
			return
		} finally {
			checking = false
		}

		// A question can only affect the score once, even if this handler is invoked again.
		if (!scored_question_ids.has(current.id)) {
			scored_question_ids.add(current.id)
			points_earned = calculateScore(submitted_with_seconds_left, result.is_correct)
			score_hundredths += Math.round(points_earned * 100)
			if (result.is_correct) correct_count += 1
		}

		playAnswerSound(result.is_correct)

		// Keep the result visible long enough for the answer sound to finish.
		advance_timeout = setTimeout(go_next, ANSWER_FEEDBACK_MS)
	}

	function go_next() {
		if (is_last) {
			on_finish(score, correct_count)
			return
		}
		index += 1
		selected_choice_id = null
		result = null
		points_earned = 0
		error = ''
		start_question_timer()
	}

	onMount(() => {
		playQuizMusic()
		start_question_timer()
	})
	onDestroy(() => {
		clearTimeout(advance_timeout)
		stop_question_timer()
		playThemeMusic()
	})
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<div class="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
		<button
			onclick={on_exit}
			class="type-action cursor-pointer font-bold text-blue-100/70 transition hover:text-white"
			>← Dashboard</button
		>
		<div class="flex items-center gap-3">
			<span class="type-label rounded-full bg-[#e52f46] px-3 py-1.5 font-black text-white"
				>{level}</span
			><span class="type-caption font-bold text-blue-100/70"
				>Question {index + 1} / {quiz.questions.length}</span
			>
			<span class="type-caption min-w-16 text-right font-black text-blue-50">{seconds_left}s</span>
		</div>
	</div>
	<div class="h-1.5 w-full overflow-hidden bg-white/10">
		<div
			class="h-full bg-[#e52f46] transition-[width] duration-1000 ease-linear"
			style={`width:${timer_progress}%`}
			role="progressbar"
			aria-label="Time remaining"
			aria-valuemin="0"
			aria-valuemax={QUESTION_TIME_SECONDS}
			aria-valuenow={seconds_left}
		></div>
	</div>

	<section
		class="flex flex-1 flex-col border-y border-white/10 bg-gradient-to-b from-[#1a3555]/90 to-[#102b49]/90 shadow-2xl shadow-black/20"
	>
		<div class="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
			<div>
				<span class="type-label rounded-full bg-cyan-400/10 px-3 py-1.5 font-black text-cyan-300"
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
			<h1 class="type-h1 mt-7 font-black text-blue-50">{current.prompt}</h1>
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
				<div class="type-body mt-6 flex items-center gap-2 font-bold text-blue-100/50">
					<span
						class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					></span>
					Checking…
				</div>
			{:else if error}
				<p
					class="type-body mt-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 font-bold text-red-200"
				>
					{error}
				</p>
			{:else if result}
				<div
					class="mt-6 rounded-xl border p-4 {result.is_correct
						? 'border-emerald-400/40 bg-emerald-400/10'
						: 'border-amber-300/40 bg-amber-300/10'}"
				>
					<p
						class="type-body font-black {result.is_correct ? 'text-emerald-300' : 'text-amber-300'}"
					>
						{result.is_correct
							? `Correct! +${formatScore(points_earned)}`
							: 'Not quite. Review the correct answer.'}
					</p>
					{#if result.explanation}
						<p class="type-body mt-1 leading-6 text-blue-100/70">{result.explanation}</p>
					{/if}
				</div>
			{/if}
		</div>
	</section>
</main>
