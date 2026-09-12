<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import { fetch_quizzes, fetch_quiz, submit_attempt } from '$lib/api/quizzes'
	import { saveQuizResult } from '$lib/client/progress'
	import type { Quiz } from '$lib/types'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let quiz = $state<Quiz | null>(null)
	let loadError = $state<string | null>(null)

	onMount(async () => {
		try {
			// 1. Fetch list of quizzes for this level
			const quizzes = await fetch_quizzes(data.level)
			if (!quizzes.length) {
				loadError = `No quizzes available for level ${data.level} yet.`
				return
			}
			// 2. Pick a random quiz from the list
			const summary = quizzes[Math.floor(Math.random() * quizzes.length)]
			// 3. Fetch the full quiz with questions
			quiz = await fetch_quiz(summary.id)
		} catch (err) {
			loadError = err instanceof Error ? err.message : 'Failed to load quiz. Please try again.'
		}
	})

	async function finish(score: number, correct: number) {
		if (data.user && quiz) {
			// Save locally (for the result screen display)
			saveQuizResult(data.user.username, {
				level: data.level,
				score,
				correct,
				total: quiz.questions.length,
			})
			// Persist to the server so it counts on the leaderboard
			await submit_attempt(quiz.id, score, correct, quiz.questions.length)
		}
		void goto(resolve('/result'))
	}
</script>

<svelte:head><title>{data.level} Quiz | Japanese Quest</title></svelte:head>

{#if loadError}
	<main class="grid min-h-screen place-items-center bg-[#071e3b] px-5 text-center text-blue-50">
		<div>
			<p class="text-lg font-black text-red-400">{loadError}</p>
			<button
				onclick={() => void goto(resolve('/dashboard'))}
				class="mt-6 cursor-pointer rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
			>← Back to Dashboard</button>
		</div>
	</main>
{:else if quiz && data.user}
	<QuizScreen
		level={data.level}
		{quiz}
		onFinish={finish}
		onExit={() => void goto(resolve('/dashboard'))}
	/>
{:else}
	<LoadingScreen />
{/if}
