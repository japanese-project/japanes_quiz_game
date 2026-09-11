<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png'
	import Icon from './Icon.svelte'

	let {
		level,
		score,
		correct,
		total,
		onDashboard,
		onRetry,
	}: {
		level: string
		score: number
		correct: number
		total: number
		onDashboard: () => void
		onRetry: () => void
	} = $props()
	let percentage = $derived(Math.round((correct / total) * 100))
</script>

<main
	class="grid min-h-screen place-items-center overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat px-5 py-12"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<section
		class="w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#1a3555] to-[#102b49] text-center shadow-xl shadow-black/25"
	>
		<div class="px-8 pt-12 pb-8 text-white">
			<div class="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 text-amber-300">
				<Icon name="trophy" size={32} />
			</div>
			<p class="mt-6 text-xs font-black tracking-[0.2em] text-cyan-300 uppercase">
				{level} complete
			</p>
			<h1 class="mt-2 text-3xl font-black">Great work!</h1>
			<p class="mt-3 text-sm text-blue-100/65">Your progress has been saved.</p>
		</div>
		<div
			class="mx-7 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:mx-10"
		>
			<div class="px-3 py-5">
				<p class="text-2xl font-black text-white">{score}</p>
				<p class="mt-1 text-[11px] font-bold text-blue-100/55 uppercase">Points</p>
			</div>
			<div class="border-x border-white/10 px-3 py-5">
				<p class="text-2xl font-black text-white">{correct}/{total}</p>
				<p class="mt-1 text-[11px] font-bold text-blue-100/55 uppercase">Correct</p>
			</div>
			<div class="px-3 py-5">
				<p class="text-2xl font-black text-white">{percentage}%</p>
				<p class="mt-1 text-[11px] font-bold text-blue-100/55 uppercase">Accuracy</p>
			</div>
		</div>
		<div class="grid gap-3 p-7 sm:grid-cols-2 sm:p-10">
			<button
				onclick={onRetry}
				class="cursor-pointer rounded-full border border-white/20 px-5 py-3.5 text-sm font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white"
				>Try Again</button
			>
			<button
				onclick={onDashboard}
				class="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#e52f46] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#f13b51]"
				>Dashboard <Icon name="arrow" size={17} /></button
			>
		</div>
	</section>
</main>
