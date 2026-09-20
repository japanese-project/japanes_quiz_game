<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import LoadingScreen from '$lib/components/LoadingScreen.svelte'
	import ResultScreen from '$lib/components/ResultScreen.svelte'
	import { getLastResult, type QuizResult } from '$lib/client/progress'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let ready = $state(false)
	let result = $state<QuizResult | null>(null)

	onMount(() => {
		result = getLastResult()
		if (!result) {
			void goto(resolve('/dashboard'), { replaceState: true })
			return
		}
		ready = true
	})

	function retry() {
		if (!result) return
		const level = result.level.toLowerCase()

		// Results saved by older builds carry no round, so those start from the category list.
		if (!result.quiz_id || !result.mode) {
			void goto(resolve('/quiz/[level]', { level }))
			return
		}

		// Replays the same category at the same length.
		const round = new URLSearchParams({ quiz: result.quiz_id, mode: result.mode })
		void goto(resolve(`/quiz/[level]?${round}`, { level }))
	}
</script>

<svelte:head><title>Quiz Result | Japanese Quest</title></svelte:head>

{#if ready && result}
	<ResultScreen
		level={result.level}
		score={result.score}
		correct={result.correct}
		total={result.total}
		onHome={() => void goto(resolve('/dashboard'))}
		onRetry={retry}
	/>
{:else}
	<LoadingScreen />
{/if}
