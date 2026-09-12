<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import { questions } from '$lib/data/questions'
	import { saveQuizResult } from '$lib/client/progress'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let activeQuestions = $derived(questions.filter((question) => question.level === data.level))

	function finish(score: number, correct: number) {
		if (data.user) {
			saveQuizResult(data.user.username, {
				level: data.level,
				score,
				correct,
				total: activeQuestions.length,
			})
		}
		void goto(resolve('/result'))
	}
</script>

<svelte:head><title>{data.level} Quiz | Japanese Quest</title></svelte:head>

{#if data.user}
	<QuizScreen
		level={data.level}
		questions={activeQuestions}
		onFinish={finish}
		onExit={() => void goto(resolve('/dashboard'))}
	/>
{/if}
