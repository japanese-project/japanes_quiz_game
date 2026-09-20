<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types'
	import { formatScore } from '$lib/scoring'
	import avatarProfiles from '$lib/data/leaderboard-avatars.json'
	import Icon from './Icon.svelte'

	let {
		rankings,
		currentUser,
		page,
		total,
		totalPages,
		hasPrevious,
		hasNext,
		onPrevious,
		onNext,
	}: {
		rankings: LeaderboardEntry[]
		currentUser: string
		page: number
		total: number
		totalPages: number
		hasPrevious: boolean
		hasNext: boolean
		onPrevious: () => void
		onNext: () => void
	} = $props()

	const avatarFor = (rank: number) => avatarProfiles[(rank - 1) % avatarProfiles.length]
	let podiumEntries = $derived(
		page === 1
			? [1, 0, 2].flatMap((index) =>
					rankings[index]
						? [{ player: rankings[index], rank: index + 1, avatar: avatarFor(index + 1) }]
						: [],
				)
			: [],
	)
</script>

<section
	class="overflow-hidden rounded-4xl border border-white/15 bg-linear-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/20 max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col max-sm:rounded-2xl"
>
	<div
		class="flex items-center justify-between border-b border-white/15 px-6 py-7 max-sm:hidden sm:px-8"
	>
		<div class="flex items-center gap-5 max-sm:gap-3">
			<span
				class="grid size-14 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-300 max-sm:size-9"
			>
				<Icon name="trophy" size={24} />
			</span>
			<div>
				<h2 class="type-h2 font-black tracking-tight text-white max-sm:text-lg">Leaderboard</h2>
				<p class="type-body mt-1 text-blue-100/60 max-sm:hidden">
					Shared learner rankings, updated live
				</p>
			</div>
		</div>
		<span
			class="type-caption rounded-full bg-white/4 px-5 py-3 font-bold text-blue-100/60 max-sm:px-3 max-sm:py-2"
			>{total} learners</span
		>
	</div>

	{#if podiumEntries.length > 0}
		<div class="grid shrink-0 grid-cols-3 items-end gap-2 px-3 pt-3 pb-2 sm:hidden">
			{#each podiumEntries as entry (entry.rank)}
				{@const isWinner = entry.rank === 1}
				<div
					class="min-w-0 text-center {entry.rank === 1
						? 'order-2'
						: entry.rank === 2
							? 'order-1'
							: 'order-3'}"
				>
					{#if isWinner}<div
							class="mb-0.5 text-lg leading-none text-amber-300"
							aria-label="First place"
						>
							♛
						</div>{/if}
					<div
						class="relative mx-auto grid place-items-center rounded-full border-[3px] font-black shadow-lg {isWinner
							? 'size-16 border-amber-300 text-xl'
							: 'size-13 border-cyan-400/70 text-base'}"
						style={`background:${entry.avatar.background};color:${entry.avatar.foreground}`}
					>
						{entry.avatar.symbol}
						<span
							class="absolute -bottom-2 grid size-5 place-items-center rounded-full bg-[#e52f46] text-[10px] font-black text-white ring-2 ring-[#142e4e]"
							>{entry.rank}</span
						>
					</div>
					<p class="mt-3 truncate text-sm font-black text-white">{entry.player.username}</p>
					<p class="text-[11px] font-bold text-cyan-200/75">
						{formatScore(entry.player.totalScore)} pts
					</p>
				</div>
			{/each}
		</div>
	{/if}

	<div class="overflow-x-auto max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-hidden">
		<table class="w-full min-w-105 text-left max-sm:min-w-0 max-sm:table-fixed">
			<thead
				class="type-label bg-[#142d4c]/80 font-black tracking-[0.16em] text-blue-100/60 uppercase max-sm:text-xs max-sm:tracking-[0.08em]"
			>
				<tr>
					<th
						class="w-28 px-6 py-5 text-center max-sm:w-14 max-sm:py-2 max-sm:pr-1 max-sm:pl-3 sm:px-8"
					>
						Rank
					</th>
					<th class="px-4 py-5 max-sm:px-3 max-sm:py-2">Name</th>
					<th
						class="px-6 py-5 text-right max-sm:w-[104px] max-sm:py-2 max-sm:pr-[10px] max-sm:pl-0 sm:px-8"
					>
						Score
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/10">
				{#each rankings as player, index (player.username)}
					{@const rank = (page - 1) * 10 + index + 1}
					{@const avatar = avatarFor(rank)}
					<tr
						class="{page === 1 && index < 3 ? 'max-sm:hidden' : ''} {player.username === currentUser
							? 'bg-[#24577f]/55'
							: 'transition hover:bg-white/5'}"
					>
						<td class="px-6 py-5 text-center max-sm:py-1 max-sm:pr-1 max-sm:pl-3 sm:px-8">
							{#if rank <= 3}
								<span
									class="type-body inline-grid size-10 place-items-center rounded-full font-black max-sm:size-7 max-sm:text-xs {rank ===
									1
										? 'bg-amber-300 text-[#102a43]'
										: rank === 2
											? 'bg-blue-100/35 text-blue-50'
											: 'bg-orange-100 text-orange-700'}">{rank}</span
								>
							{:else}
								<span class="type-body font-bold text-blue-100/55 max-sm:text-sm">{rank}</span>
							{/if}
						</td>
						<td class="px-4 py-5 max-sm:px-3 max-sm:py-1">
							<div class="flex min-w-0 items-center gap-3 max-sm:gap-0">
								<span
									class="type-body grid size-10 place-items-center rounded-full bg-[#1a3150] font-black text-blue-50 max-sm:hidden"
									>{player.username.slice(0, 1).toUpperCase()}</span
								>
								<span
									class="mr-2 hidden size-7 shrink-0 place-items-center rounded-full text-[11px] font-black max-sm:grid sm:hidden"
									style={`background:${avatar.background};color:${avatar.foreground}`}
									>{avatar.symbol}</span
								>
								<div class="min-w-0 max-sm:flex max-sm:items-center">
									<span
										class="type-body block truncate font-black text-blue-50 max-sm:min-w-0 max-sm:text-sm"
										>{player.username}</span
									>
									{#if player.username === currentUser}<span
											class="type-label ml-1 shrink-0 rounded-full bg-[#c9273e] px-2 py-0.5 font-black text-white max-sm:px-1 max-sm:py-0 max-sm:text-[10px]"
											>You</span
										>{/if}
								</div>
							</div>
						</td>
						<td
							class="px-6 py-5 text-right text-base font-black whitespace-nowrap text-blue-50 max-sm:py-1 max-sm:pr-[10px] max-sm:pl-0 max-sm:text-[13px] sm:px-8"
							>{formatScore(player.totalScore)} pts</td
						>
					</tr>
				{:else}
					<tr>
						<td colspan="3" class="type-body px-6 py-12 text-center font-semibold text-blue-100/65">
							No completed quiz attempts yet. Be the first learner on the board!
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if total > 0}
		<footer
			class="flex shrink-0 items-center justify-between border-t border-white/10 px-6 py-5 max-sm:px-3 max-sm:py-2 sm:px-8"
		>
			<p class="type-caption font-bold text-blue-100/60">
				Page {page} of {totalPages}<span class="max-sm:hidden"> · 10 learners per page</span>
			</p>
			<div class="flex gap-2">
				<button
					onclick={onPrevious}
					disabled={!hasPrevious}
					class="type-action cursor-pointer rounded-full border border-white/15 px-4 py-2 font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40 max-sm:px-3 max-sm:py-1.5 max-sm:text-sm"
					>Previous</button
				>
				<button
					onclick={onNext}
					disabled={!hasNext}
					class="type-action cursor-pointer rounded-full border border-white/15 px-4 py-2 font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40 max-sm:px-3 max-sm:py-1.5 max-sm:text-sm"
					>Next</button
				>
			</div>
		</footer>
	{/if}
</section>
