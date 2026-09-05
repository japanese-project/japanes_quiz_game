<script lang="ts">
	import patternBackground from '$lib/assets/pattern1.png';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	let {
		username,
		totalScore,
		onHome,
		onLogout
	}: { username: string; totalScore: number; onHome: () => void; onLogout: () => void } = $props();
</script>

<header
	class="border-b border-white/10 bg-[#0d2948] bg-cover bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(9, 31, 56, 0.9), rgba(9, 31, 56, 0.94)), url('${patternBackground}')`}
>
	<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
		<button onclick={onHome} aria-label="Go to dashboard" class="cursor-pointer"
			><Logo light /></button
		>
		<div class="flex items-center gap-3 sm:gap-5">
			<div
				class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-amber-300 sm:flex"
			>
				<Icon name="trophy" size={17} />
				{totalScore} pts
			</div>
			<div class="flex items-center gap-2">
				<div class="grid size-9 place-items-center rounded-full bg-[#d52b45] font-black text-white">
					{username.slice(0, 1).toUpperCase()}
				</div>
				<span class="hidden text-sm font-bold text-white sm:block">{username}</span>
			</div>
			<button
				onclick={onLogout}
				class="grid size-9 cursor-pointer place-items-center rounded-lg text-blue-200/60 transition hover:bg-white/10 hover:text-white"
				aria-label="Log out"
			>
				<Icon name="logout" size={19} />
			</button>
		</div>
	</div>
</header>
