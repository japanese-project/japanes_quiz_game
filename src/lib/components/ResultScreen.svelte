<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png'
	import { formatScore } from '$lib/scoring'
	import Icon from './Icon.svelte'

	let {
		level,
		score,
		correct,
		total,
		onHome,
		onRetry,
	}: {
		level: string
		score: number
		correct: number
		total: number
		onHome: () => void
		onRetry: () => void
	} = $props()
	let percentage = $derived(Math.round((correct / total) * 100))
</script>

<main
	class="app-pattern-bg grid min-h-screen place-items-center overflow-x-hidden bg-cover bg-fixed bg-center bg-no-repeat px-5 py-12"
	style={`--pattern-image:url('${patternBackground}')`}
>
	<section
		class="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-bg-deep text-center shadow-xl shadow-black/25"
	>
		<div class="px-8 pt-12 pb-8 text-text-primary">
			<div class="mx-auto grid size-16 place-items-center rounded-2xl bg-warning/10 text-warning">
				<Icon name="trophy" size={32} />
			</div>
			<p class="type-label mt-6 font-black tracking-[0.2em] text-secondary-hover uppercase">
				{level} complete
			</p>
			<h1 class="type-h1 mt-2 font-black">Great work!</h1>
			<p class="type-body mt-3 text-text-secondary">Your progress has been saved.</p>
		</div>
		<div
			class="mx-7 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-surface-hover/25 sm:mx-10"
		>
			<div class="px-3 py-5">
				<p class="text-2xl font-black text-text-primary">{formatScore(score)}</p>
				<p class="type-label mt-1 font-bold text-text-secondary uppercase">Points</p>
			</div>
			<div class="border-x border-border px-3 py-5">
				<p class="text-2xl font-black text-text-primary">{correct}/{total}</p>
				<p class="type-label mt-1 font-bold text-text-secondary uppercase">Correct</p>
			</div>
			<div class="px-3 py-5">
				<p class="text-2xl font-black text-text-primary">{percentage}%</p>
				<p class="type-label mt-1 font-bold text-text-secondary uppercase">Accuracy</p>
			</div>
		</div>
		<div class="grid gap-3 p-7 sm:grid-cols-2 sm:p-10">
			<button
				onclick={onRetry}
				class="type-action cursor-pointer rounded-full border border-border px-5 py-3.5 font-bold text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
				>Try Again</button
			>
			<button
				onclick={onHome}
				class="type-action flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-bold text-text-primary transition hover:bg-primary-hover"
				>Home <Icon name="arrow" size={17} /></button
			>
		</div>
	</section>
</main>
