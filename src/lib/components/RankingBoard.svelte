<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types'
	import { formatScore } from '$lib/scoring'
	import avatarProfiles from '$lib/data/leaderboard-avatars.json'

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
	class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-white/15 bg-linear-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/20"
>
	{#if podiumEntries.length > 0}
		<div class="grid shrink-0 grid-cols-3 items-end gap-2 px-3 pt-3 pb-2 sm:px-10 sm:pt-6 sm:pb-5">
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
							class="mb-0.5 text-lg leading-none text-amber-300 sm:text-2xl"
							aria-label="First place"
						>
							♛
						</div>{/if}
					<div
						class="relative mx-auto grid place-items-center rounded-full border-[3px] font-black shadow-lg {isWinner
							? 'size-16 border-amber-300 text-xl sm:size-24 sm:text-3xl'
							: 'size-13 border-cyan-400/70 text-base sm:size-20 sm:text-2xl'}"
						style={`background:${entry.avatar.background};color:${entry.avatar.foreground}`}
					>
						{entry.avatar.symbol}
						<span
							class="absolute -bottom-2 grid size-5 place-items-center rounded-full bg-[#e52f46] text-[10px] font-black text-white ring-2 ring-[#142e4e] sm:size-7 sm:text-sm"
							>{entry.rank}</span
						>
					</div>
					<p class="mt-3 truncate text-sm font-black text-white sm:text-lg">
						{entry.player.username}
					</p>
					<p class="text-[11px] font-bold text-cyan-200/75 sm:text-sm">
						{formatScore(entry.player.totalScore)} pts
					</p>
				</div>
			{/each}
		</div>
	{/if}

	<div class="min-h-0 flex-1 overflow-hidden">
		<table class="w-full table-fixed text-left">
			<thead
				class="bg-[#142d4c]/80 text-xs font-black tracking-[0.08em] text-blue-100/60 uppercase sm:text-sm"
			>
				<tr>
					<th class="w-14 py-2 pr-1 pl-3 text-center sm:w-20 sm:py-3"> Rank </th>
					<th class="px-3 py-2 sm:py-3">Name</th>
					<th class="w-[104px] py-2 pr-[10px] pl-0 text-right sm:w-36 sm:py-3 sm:pr-5"> Score </th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/10">
				{#each rankings as player, index (player.username)}
					{@const rank = (page - 1) * 10 + index + 1}
					{@const avatar = avatarFor(rank)}
					<tr
						class="{page === 1 && index < 3 ? 'hidden' : ''} {player.username === currentUser
							? 'bg-[#24577f]/55'
							: 'transition hover:bg-white/5'}"
					>
						<td class="py-1 pr-1 pl-3 text-center sm:py-2">
							{#if rank <= 3}
								<span
									class="inline-grid size-7 place-items-center rounded-full text-xs font-black {rank ===
									1
										? 'bg-amber-300 text-[#102a43]'
										: rank === 2
											? 'bg-blue-100/35 text-blue-50'
											: 'bg-orange-100 text-orange-700'}">{rank}</span
								>
							{:else}
								<span class="text-sm font-bold text-blue-100/55">{rank}</span>
							{/if}
						</td>
						<td class="px-3 py-1 sm:py-2">
							<div class="flex min-w-0 items-center">
								<span
									class="mr-2 grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-black sm:size-9 sm:text-sm"
									style={`background:${avatar.background};color:${avatar.foreground}`}
									>{avatar.symbol}</span
								>
								<div class="flex min-w-0 items-center">
									<span class="block min-w-0 truncate text-sm font-black text-blue-50 sm:text-base"
										>{player.username}</span
									>
									{#if player.username === currentUser}<span
											class="ml-1 shrink-0 rounded-full bg-[#c9273e] px-1 py-0 text-[10px] font-black text-white"
											>You</span
										>{/if}
								</div>
							</div>
						</td>
						<td
							class="py-1 pr-[10px] pl-0 text-right text-[13px] font-black whitespace-nowrap text-blue-50 sm:py-2 sm:pr-5 sm:text-base"
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
			class="flex shrink-0 items-center justify-between border-t border-white/10 px-3 py-2 sm:px-6 sm:py-3"
		>
			<p class="type-caption font-bold text-blue-100/60">
				Page {page} of {totalPages}
			</p>
			<div class="flex gap-2">
				<button
					onclick={onPrevious}
					disabled={!hasPrevious}
					class="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-sm font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
					>Previous</button
				>
				<button
					onclick={onNext}
					disabled={!hasNext}
					class="cursor-pointer rounded-full border border-white/15 px-3 py-1.5 text-sm font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
					>Next</button
				>
			</div>
		</footer>
	{/if}
</section>
