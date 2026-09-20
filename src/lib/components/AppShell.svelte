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
		active: 'quizzes' | 'leaderboard' | 'credits'
		onLogout: () => void
		children: Snippet
	} = $props()
</script>

<main
	class="app-pattern-bg flex min-h-screen flex-col overflow-x-hidden bg-cover bg-fixed bg-center bg-no-repeat {active !==
	'credits'
		? 'max-sm:h-dvh max-sm:min-h-0 max-sm:overflow-hidden'
		: ''}"
	style={`--pattern-image:url('${patternBackground}')`}
>
	<header class="border-b border-border/50 bg-bg-deep/95">
		<div
			class="mx-auto flex min-h-24 max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-4 max-sm:min-h-0 max-sm:gap-2 max-sm:px-4 max-sm:py-3 sm:px-8"
		>
			<a href={resolve('/dashboard')} aria-label="Japanese Quest dashboard"><Logo light /></a>
			<div class="flex items-center gap-3 max-sm:contents sm:gap-5">
				<nav
					class="flex rounded-full border border-border bg-surface/20 p-1.5 shadow-lg shadow-black/10 max-sm:order-3 max-sm:mt-[30px] max-sm:w-full max-sm:p-1"
					aria-label="Main navigation"
				>
					<a
						href={resolve('/dashboard')}
						aria-current={active === 'quizzes' ? 'page' : undefined}
						class="type-action flex items-center justify-center gap-2 rounded-full px-4 py-3 font-black transition max-sm:flex-1 max-sm:px-2 max-sm:py-2.5 sm:px-7 {active ===
						'quizzes'
							? 'bg-primary text-text-primary shadow-sm'
							: 'text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary'}"
						><Icon name="book" size={18} /> Quizzes</a
					>
					<a
						href={resolve('/leaderboard')}
						aria-current={active === 'leaderboard' ? 'page' : undefined}
						class="type-action flex items-center justify-center gap-2 rounded-full px-4 py-3 font-black transition max-sm:flex-1 max-sm:px-2 max-sm:py-2.5 sm:px-7 {active ===
						'leaderboard'
							? 'bg-primary text-text-primary shadow-sm'
							: 'text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary'}"
						><Icon name="trophy" size={18} /> <span class="hidden md:inline">Leaderboard</span><span
							class="md:hidden">Ranks</span
						></a
					>
					<a
						href={resolve('/credits')}
						aria-current={active === 'credits' ? 'page' : undefined}
						class="type-action flex items-center justify-center gap-2 rounded-full px-4 py-3 font-black transition max-sm:flex-1 max-sm:px-2 max-sm:py-2.5 sm:px-7 {active ===
						'credits'
							? 'bg-primary text-text-primary shadow-sm'
							: 'text-text-secondary hover:bg-surface-hover/60 hover:text-text-primary'}"
						><Icon name="users" size={18} /> <span class="hidden md:inline">Credits</span><span
							class="md:hidden">Team</span
						></a
					>
				</nav>
				<button
					onclick={onLogout}
					class="type-action flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface/20 px-4 py-3.5 font-bold text-text-secondary transition hover:bg-surface-hover/60 hover:text-text-primary max-sm:p-3 sm:px-6"
					aria-label={`Log out ${username}`}
					><Icon name="logout" size={18} /><span class="hidden sm:inline">Log out</span></button
				>
			</div>
		</div>
	</header>

	<div
		class="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 max-sm:px-4 max-sm:py-3 sm:px-8 sm:py-10 {active !==
		'credits'
			? 'max-sm:min-h-0 max-sm:overflow-hidden'
			: ''}"
	>
		{@render children()}
	</div>
</main>
