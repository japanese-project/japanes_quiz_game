<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png';
	import Icon from './Icon.svelte';

	let {
		onDashboard,
		onRetry
	}: {
		onDashboard: () => void;
		onRetry: () => void;
	} = $props();
</script>

<main
	class="grid min-h-screen place-items-center overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat px-5 py-12"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<section
		class="w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#1a3555] to-[#102b49] text-center shadow-xl shadow-black/25"
	>
		<div class="px-8 py-14 text-white">
			<div class="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 text-amber-300">
				<Icon name="trophy" size={32} />
			</div>
			<h1 class="mt-6 text-3xl font-black">Great work!</h1>
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
