<script lang="ts">
	import type { Snippet } from 'svelte'
	import { resolve } from '$app/paths'
	import patternBackground from '$lib/assets/pattern1.png'
	import Icon from './Icon.svelte'
	import Logo from './Logo.svelte'

	let {
		username,
		active,
		onLogout,
		children,
	}: {
		username: string
		active: 'quizzes' | 'leaderboard'
		onLogout: () => void
		children: Snippet
	} = $props()
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<header class="border-b border-white/10 bg-[#061b35]/95">
		<div
			class="mx-auto flex min-h-24 max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8"
		>
			<a href={resolve('/dashboard')} aria-label="Japanese Quest dashboard"><Logo light /></a>
			<div class="flex items-center gap-3 sm:gap-5">
				<nav
					class="flex rounded-full border border-white/15 bg-white/[0.04] p-1.5 shadow-lg shadow-black/10"
					aria-label="Main navigation"
				>
					<a
						href={resolve('/dashboard')}
						aria-current={active === 'quizzes' ? 'page' : undefined}
						class="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition sm:px-7 {active ===
						'quizzes'
							? 'bg-[#e52f46] text-white shadow-sm'
							: 'text-blue-100/70 hover:bg-white/10 hover:text-white'}"
						><Icon name="book" size={18} /> Quizzes</a
					>
					<a
						href={resolve('/leaderboard')}
						aria-current={active === 'leaderboard' ? 'page' : undefined}
						class="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition sm:px-7 {active ===
						'leaderboard'
							? 'bg-[#e52f46] text-white shadow-sm'
							: 'text-blue-100/70 hover:bg-white/10 hover:text-white'}"
						><Icon name="trophy" size={18} /> Leaderboard</a
					>
				</nav>
				<button
					onclick={onLogout}
					class="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-blue-100/70 transition hover:bg-white/10 hover:text-white sm:px-6"
					aria-label={`Log out ${username}`}
					><Icon name="logout" size={18} /><span class="hidden sm:inline">Log out</span></button
				>
			</div>
		</div>
	</header>

	<div class="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10">
		{@render children()}
	</div>
</main>
