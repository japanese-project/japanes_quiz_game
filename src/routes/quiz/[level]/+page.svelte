<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import CategoryScreen from '$lib/components/CategoryScreen.svelte'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import ModeScreen from '$lib/components/ModeScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import { fetch_quizzes, fetch_quiz, submit_attempt } from '$lib/api/quizzes'
	import { saveQuizResult } from '$lib/client/progress'
	import { playThemeMusic } from '$lib/client/audio'
	import { ROUND_MODES, round_size, type RoundMode } from '$lib/quiz_config'
	import type { Quiz, QuizSummary } from '$lib/types'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	// A round is built in steps on this page: pick a category, then a length, then play.
	let quizzes = $state<QuizSummary[] | null>(null)
	let selected_quiz = $state<QuizSummary | null>(null)
	let selected_mode = $state<RoundMode | null>(null)
	let quiz = $state<Quiz | null>(null)
	let load_error = $state<string | null>(null)

	const to_dashboard = () => void goto(resolve('/dashboard'))

	onMount(async () => {
		playThemeMusic()
		try {
			quizzes = await fetch_quizzes(data.level)
		} catch (thrown) {
			load_error = thrown instanceof Error ? thrown.message : 'Could not load quizzes.'
			return
		}

		// "Try Again" links back with ?quiz=&mode= so the same round replays without
		// making the player pick it again. Unknown values fall through to the category list.
		const params = page.url.searchParams
		const retry_quiz = quizzes.find((item) => item.id === params.get('quiz'))
		const retry_mode = ROUND_MODES.find((mode) => mode.id === params.get('mode'))
		if (retry_quiz && retry_mode) {
			selected_quiz = retry_quiz
			await start_round(retry_mode)
		}
	})

	async function start_round(mode: RoundMode) {
		if (!selected_quiz) return
		selected_mode = mode

		try {
			quiz = await fetch_quiz(selected_quiz.id, round_size(mode, selected_quiz.question_count))
		} catch (thrown) {
			load_error = thrown instanceof Error ? thrown.message : 'Could not load that quiz.'
		}
	}

	async function finish(score: number, correct: number) {
		if (data.user && quiz && selected_mode) {
			// Save locally (for the result screen display)
			saveQuizResult(data.user.username, {
				level: data.level,
				score,
				correct,
				total: quiz.questions.length,
				quiz_id: quiz.id,
				mode: selected_mode.id,
			})
			// Persist to the server so it counts on the leaderboard
			await submit_attempt(quiz.id, score, correct, quiz.questions.length)
		}
		void goto(resolve('/result'))
	}
</script>

<svelte:head><title>{data.level} Quiz | Japanese Quest</title></svelte:head>

{#if load_error}
	<main
		class="grid min-h-screen place-items-center bg-bg-primary px-5 text-center text-text-primary"
	>
		<div>
			<p class="type-h3 font-black text-error">{load_error}</p>
			<button
				onclick={to_dashboard}
				class="type-action mt-6 cursor-pointer rounded-full bg-surface px-5 py-3 font-bold text-text-primary hover:bg-surface-hover"
				>← Back to Dashboard</button
			>
		</div>
	</main>
{:else if quiz && data.user}
	<QuizScreen level={data.level} {quiz} on_finish={finish} on_exit={to_dashboard} />
{:else if selected_quiz && !selected_mode}
	<ModeScreen quiz={selected_quiz} on_start={start_round} on_back={() => (selected_quiz = null)} />
{:else if quizzes && !selected_quiz}
	<CategoryScreen
		level={data.level}
		{quizzes}
		on_select={(item) => (selected_quiz = item)}
		on_back={to_dashboard}
	/>
{:else}
	<LoadingScreen />
{/if}
