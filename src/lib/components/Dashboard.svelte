<script lang="ts">
	import type { Level } from '$lib/types';
	import patternBackground from '$lib/assets/pattern1.png';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import RankingBoard from './RankingBoard.svelte';

	type Ranking = {
		username: string;
		totalScore: number;
		answered: number;
		accuracy: number;
	};

	let {
		username,
		rankings,
		onStart,
		onLogout
	}: {
		username: string;
		rankings: Ranking[];
		onStart: (level: Level) => void;
		onLogout: () => void;
	} = $props();
	let activeTab = $state<'quizzes' | 'leaderboard'>('quizzes');
	const levels: Array<{
		level: Level;
		label: string;
		subtitle: string;
		description: string;
		color: string;
		tag: string;
	}> = [
		{
			level: 'N4',
			label: 'Foundation Level',
			subtitle: 'Foundation',
			description: 'Essential vocabulary, kanji and grammar used in everyday situations.',
			color: '#08b3c0',
			tag: 'Recommended'
		},
		{
			level: 'N3',
			label: 'Intermediate Level',
			subtitle: 'Intermediate',
			description: 'Natural Japanese with longer sentences and more nuanced grammar.',
			color: '#e52f46',
			tag: 'Challenge'
		}
	];
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<header class="border-b border-white/10 bg-[#061b35]/95">
		<div class="mx-auto flex min-h-24 max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
			<Logo light />
			<div class="flex items-center gap-3 sm:gap-5">
			<nav
				class="flex rounded-full border border-white/15 bg-white/[0.04] p-1.5 shadow-lg shadow-black/10"
				aria-label="Dashboard sections"
			>
				<button
					onclick={() => (activeTab = 'quizzes')}
					class="flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition sm:px-7 {activeTab ===
					'quizzes'
						? 'bg-[#e52f46] text-white shadow-sm'
						: 'text-blue-100/70 hover:bg-white/10 hover:text-white'}"
					><Icon name="book" size={18} /> Quizzes</button
				>
				<button
					onclick={() => (activeTab = 'leaderboard')}
					class="flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition sm:px-7 {activeTab ===
					'leaderboard'
						? 'bg-[#e52f46] text-white shadow-sm'
						: 'text-blue-100/70 hover:bg-white/10 hover:text-white'}"
					><Icon name="trophy" size={18} /> Leaderboard</button
				>
			</nav>
			<button
				onclick={onLogout}
				class="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-blue-100/70 transition hover:bg-white/10 hover:text-white sm:px-6"
				aria-label="Log out"
				><Icon name="logout" size={18} /><span class="hidden sm:inline">Log out</span></button
			>
			</div>
		</div>
	</header>

	<div class="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 py-8 sm:px-8 sm:py-10">

		{#if activeTab === 'quizzes'}
			<div class="mb-8 flex items-center justify-between gap-5">
				<div>
					<h2 class="text-2xl font-black tracking-tight text-white">Choose a level</h2>
					<p class="mt-2 text-sm text-blue-100/65">Each quiz contains 6 mixed questions</p>
				</div>
				<span
					class="hidden rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-blue-100/75 backdrop-blur-sm sm:inline-flex"
					>JLPT Practice</span
				>
			</div>

			<section class="grid items-stretch gap-7 lg:grid-cols-2">
				{#each levels as item (item.level)}
					<article
						class="group overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-white/25 hover:shadow-black/25"
					>
						<div class="h-2" style={`background:${item.color}`}></div>
						<div class="flex min-h-[350px] flex-col p-6 sm:p-7">
							<div class="flex items-center gap-5">
								<div
									class="grid size-16 shrink-0 place-items-center rounded-full text-xl font-black shadow-sm {item.level ===
									'N4'
										? 'text-[#08243d]'
										: 'text-white'}"
									style={`background:${item.color}`}
								>
									{item.level}
								</div>
								<div>
									<span
										class="rounded-full px-3 py-1.5 text-xs font-black tracking-wide"
										style={`background:${item.color}22;color:${item.color}`}>{item.tag}</span
									>
									<h3 class="mt-3 text-xl font-black tracking-tight text-white">{item.label}</h3>
									<p class="mt-2 text-sm font-medium text-blue-100/60">{item.level} · {item.subtitle}</p>
								</div>
							</div>
							<p class="mt-8 text-sm leading-7 text-blue-100/65">{item.description}</p>
							<div class="mt-6 flex flex-wrap gap-2.5">
								{#each ['Vocabulary', 'Kanji', 'Grammar'] as tag (tag)}<span
										class="rounded-full bg-white/[0.05] px-4 py-2 text-xs font-bold text-blue-100/65"
										>{tag}</span
									>{/each}
							</div>
							<div class="mt-auto flex items-center justify-between border-t border-white/15 pt-6">
								<span class="text-sm font-medium text-blue-100/65">6 questions</span>
								<button
									onclick={() => onStart(item.level)}
									class="flex cursor-pointer items-center gap-3 rounded-full bg-[#e52f46] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#f13b51] hover:shadow-lg"
									>Start Quiz <Icon name="arrow" size={17} /></button
								>
							</div>
						</div>
					</article>
				{/each}
			</section>
		{:else}
			<RankingBoard {rankings} currentUser={username} />
		{/if}

		<p class="mt-10 text-center text-sm text-blue-100/60">
			Signed in as {username} · progress saved on this browser
		</p>
	</div>
</main>
