<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import { questions } from '$lib/data/questions'
	import { getSession, saveQuizResult } from '$lib/client/progress'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let ready = $state(false)
	let username = $state('')
	let activeQuestions = $derived(questions.filter((question) => question.level === data.level))

	onMount(() => {
		const session = getSession()
		if (!session.username) {
			void goto(resolve('/'), { replaceState: true })
			return
		}
		username = session.username
		ready = true
	})

	function finish(score: number, correct: number) {
		saveQuizResult(username, {
			level: data.level,
			score,
			correct,
			total: activeQuestions.length,
		})
		void goto(resolve('/result'))
	}
</script>

<svelte:head><title>{data.level} Quiz | Japanese Quest</title></svelte:head>

{#if ready}
	<QuizScreen
		level={data.level}
		questions={activeQuestions}
		onFinish={finish}
		onExit={() => void goto(resolve('/dashboard'))}
	/>
{:else}
	<LoadingScreen />
{/if}
