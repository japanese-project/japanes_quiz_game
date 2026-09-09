<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import ResultScreen from '$lib/components/ResultScreen.svelte'
	import { getLastResult, getSession, type QuizResult } from '$lib/client/progress'

	let ready = $state(false)
	let result = $state<QuizResult | null>(null)

	onMount(() => {
		if (!getSession().username) {
			void goto(resolve('/'), { replaceState: true })
			return
		}
		result = getLastResult()
		if (!result) {
			void goto(resolve('/dashboard'), { replaceState: true })
			return
		}
		ready = true
	})

	function retry() {
		if (result) {
			void goto(resolve('/quiz/[level]', { level: result.level.toLowerCase() }))
		}
	}
</script>

<svelte:head><title>Quiz Result | Japanese Quest</title></svelte:head>

{#if ready && result}
	<ResultScreen
		level={result.level}
		score={result.score}
		correct={result.correct}
		total={result.total}
		onDashboard={() => void goto(resolve('/dashboard'))}
		onRetry={retry}
	/>
{:else}
	<LoadingScreen />
{/if}
