<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	import patternBackground from '$lib/assets/pattern1.png'
	import type { AnswerResult, Level, Quiz } from '$lib/types'
	import { reveal_answer, submit_answer } from '$lib/api/quizzes'
	import { playAnswerSound, playQuizMusic, playThemeMusic } from '$lib/client/audio'
	import { calculateScore, QUESTION_TIME_SECONDS } from '$lib/scoring'
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
	let question_timer: ReturnType<typeof setInterval> | undefined
	const scored_question_ids = new Set<string>()

	let seconds_left = $state(QUESTION_TIME_SECONDS)

	/** Map of question id → { selected_choice_id, result } for answered questions */
	type SavedAnswer = { selected_choice_id: string | null; result: AnswerResult }
	const answers_map = new Map<string, SavedAnswer>()

	/** The furthest question index the user has reached (unanswered questions beyond this are locked) */
	let furthest_index = $state(0)

	/** Whether we are reviewing a previously answered question */
	let is_reviewing = $derived(
		answers_map.has(quiz.questions[index]?.id ?? '') && index < furthest_index
	)

	let current = $derived(quiz.questions[index])
	let is_last = $derived(index === quiz.questions.length - 1)
	let score = $derived(score_hundredths / 100)
	let timer_progress = $derived((seconds_left / QUESTION_TIME_SECONDS) * 100)

	/** Can go back if not on the first question */
	let can_go_back = $derived(index > 0)
	/** Can go next if current question is answered */
	let can_go_next = $derived(answers_map.has(current?.id ?? '') || result !== null)

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
				void handle_timeout()
			}
		}, 1000)
	}

	async function handle_timeout() {
		if (result || checking) return
		checking = true
		error = ''
		selected_choice_id = null
		points_earned = 0

		// The regular one-second width transition would otherwise still show the last
		// sliver of the progress bar while the answer is being revealed. Let the zero
		// state paint first so the visual countdown and timeout agree exactly.
		await tick()
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

		try {
			result = await reveal_answer(quiz.id, current.id)
			playAnswerSound(false)
		} catch (thrown) {
			error = thrown instanceof Error ? thrown.message : 'Could not reveal the correct answer.'
		} finally {
			checking = false
		}

		// Save so the user can review; they must click Next manually.
		if (result) {
			save_current_answer()
		}
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

		// Save answer; user must click Next manually to proceed.
		save_current_answer()
	}

	/** Save the current question's answer into the history map */
	function save_current_answer() {
		if (result) {
			answers_map.set(current.id, { selected_choice_id, result })
		}
	}

	/** Load a previously saved answer into the active state */
	function load_saved_answer(question_id: string) {
		const saved = answers_map.get(question_id)
		if (saved) {
			selected_choice_id = saved.selected_choice_id
			result = saved.result
		} else {
			selected_choice_id = null
			result = null
		}
		error = ''
		points_earned = 0
	}

	function go_next() {
		if (index < furthest_index) {
			// Navigating forward within reviewed questions
			index += 1
			load_saved_answer(quiz.questions[index].id)
			stop_question_timer()
		} else if (index === furthest_index && answers_map.has(current.id)) {
			// Moving past the last answered question to the next unanswered one
			if (is_last) {
				on_finish(score, correct_count)
				return
			}
			index += 1
			furthest_index = index
			selected_choice_id = null
			result = null
			points_earned = 0
			error = ''
			start_question_timer()
		}
	}

	function go_back() {
		if (!can_go_back) return
		stop_question_timer()
		index -= 1
		load_saved_answer(quiz.questions[index].id)
	}

	onMount(() => {
		playQuizMusic()
		start_question_timer()
	})
	onDestroy(() => {
		stop_question_timer()
		playThemeMusic()
	})
</script>

<main
	class="app-pattern-bg flex h-dvh flex-col overflow-hidden bg-cover bg-fixed bg-center bg-no-repeat"
	style={`--pattern-image:url('${patternBackground}')`}
>
	<div
		class="mx-auto grid w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-x-2 px-3 py-2.5 sm:grid-cols-[1fr_auto_1fr] sm:px-8 sm:py-5"
	>
		<button
			onclick={on_exit}
			class="grid h-9 w-9 cursor-pointer place-items-center justify-self-start rounded-xl border border-border bg-surface/80 text-xl leading-none font-bold text-text-secondary shadow-sm transition hover:border-secondary/60 hover:bg-surface-hover hover:text-text-primary active:scale-95 sm:h-11 sm:w-12 sm:text-2xl"
			aria-label="Back to dashboard"
			><span aria-hidden="true">←</span><span class="sr-only"> Dashboard</span></button
		>
		<div class="contents">
			<span
				class="type-label col-start-2 row-start-1 justify-self-center rounded-full bg-primary px-3 py-1.5 font-black text-text-primary sm:px-4 sm:py-2"
				>{level}</span
			><span
				class="type-caption col-start-3 row-start-1 justify-self-end text-xs font-bold whitespace-nowrap text-text-secondary sm:text-sm"
				>Q {index + 1}/{quiz.questions.length}</span
			>
		</div>
	</div>
	<div class="h-1.5 w-full shrink-0 overflow-hidden bg-disabled/25">
		{#if !is_reviewing}
			<div
				class="h-full bg-secondary transition-[width] duration-1000 ease-linear"
				style={`width:${timer_progress}%;transition-duration:${seconds_left === 0 || seconds_left === QUESTION_TIME_SECONDS ? 0 : 1000}ms`}
				role="progressbar"
				aria-label="Time remaining"
				aria-valuemin="0"
				aria-valuemax={QUESTION_TIME_SECONDS}
				aria-valuenow={seconds_left}
			></div>
		{/if}
	</div>

	<!-- Scrollable question area -->
	<section
		class="flex-1 overflow-y-auto border-t border-border bg-gradient-to-b from-surface/95 to-bg-deep"
	>
		<div class="mx-auto w-full max-w-2xl px-4 py-5 sm:px-8 sm:py-10">
			<div class="flex flex-wrap items-center gap-2">
				<span
					class="type-label rounded-full bg-secondary/10 px-3 py-1.5 font-black text-secondary-hover"
					>{current.category}</span
				>
				{#if is_reviewing}
					<span
						class="type-label rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-black text-primary"
					>
						📖 Review
					</span>
				{/if}
			</div>
			{#if current.image}<div
					class="mt-4 mb-5 grid h-28 place-items-center rounded-2xl border border-border bg-bg-deep/65 text-5xl sm:h-32 sm:text-6xl"
					role="img"
					aria-label="Question illustration"
				>
					{current.image}
				</div>{/if}
			<h1 class="quiz-question type-h1 mt-5 font-black text-text-primary sm:mt-7">
				{current.prompt}
			</h1>
			<div class="mt-5 grid gap-2.5 sm:mt-7 sm:gap-3">
				{#each current.choices as choice, choice_index (choice.id)}
					<AnswerOption
						{choice}
						index={choice_index}
						selected={selected_choice_id}
						correct_choice_id={result?.correct_choice_id ?? null}
						submitted={!!result}
						checking={checking && !is_reviewing}
						onSelect={is_reviewing ? () => {} : select_answer}
					/>
				{/each}
			</div>

			{#if checking && !is_reviewing}
				<div class="type-body mt-5 flex items-center gap-2 font-bold text-text-secondary">
					<span
						class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					></span>
					Checking…
				</div>
			{:else if error}
				<p
					class="type-body mt-5 rounded-xl border border-error/60 bg-error/10 p-3 font-bold text-error sm:mt-6 sm:p-4"
				>
					{error}
				</p>
			{/if}

			{#if result?.explanation}
				<div
					class="type-body mt-5 rounded-xl border border-secondary/30 bg-secondary/8 px-4 py-3 text-text-secondary sm:mt-6 sm:px-5 sm:py-4"
				>
					<p class="mb-1 text-xs font-black uppercase tracking-wider text-secondary">
						💡 Explanation
					</p>
					<p class="text-sm leading-relaxed sm:text-base">{result.explanation}</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Sticky bottom nav bar — always visible, never scrolls away -->
	{#if result || is_reviewing}
		<div
			class="nav-bar shrink-0 border-t border-border bg-surface/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:px-8"
		>
			<div class="mx-auto grid w-full max-w-2xl grid-cols-2 gap-2 sm:flex sm:justify-between sm:gap-3">
				<button
					onclick={go_back}
					disabled={!can_go_back}
					class="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-sm font-bold text-text-secondary shadow-sm transition hover:border-secondary/60 hover:bg-surface-hover hover:text-text-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5 sm:text-base"
				>
					<span aria-hidden="true">←</span> Back
				</button>
				<button
					onclick={go_next}
					disabled={!can_go_next}
					class="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-secondary bg-secondary px-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-6 sm:text-base"
				>
					{#if is_last && !is_reviewing}
						Finish 🎉
					{:else}
						Next <span aria-hidden="true">→</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.quiz-question {
		font-size: clamp(1.2rem, 4vw, 2rem);
		line-height: 1.35;
	}

	/* Respect the iPhone home bar so buttons aren't clipped */
	.nav-bar {
		padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
	}
</style>
