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

	const avatarColors = [
		{ background: 'var(--color-secondary)', foreground: 'var(--color-bg-deep)' },
		{ background: 'var(--color-warning)', foreground: 'var(--color-bg-deep)' },
		{ background: 'var(--color-primary)', foreground: 'var(--color-text-primary)' },
		{ background: 'var(--color-surface-hover)', foreground: 'var(--color-text-primary)' },
		{ background: 'var(--color-warning)', foreground: 'var(--color-bg-deep)' },
		{ background: 'var(--color-success)', foreground: 'var(--color-bg-deep)' },
		{ background: 'var(--color-text-secondary)', foreground: 'var(--color-bg-deep)' },
	] as const
	const avatarFor = (rank: number) => ({
		...avatarProfiles[(rank - 1) % avatarProfiles.length],
		...avatarColors[(rank - 1) % avatarColors.length],
	})
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
	class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-linear-to-b from-surface to-bg-deep shadow-xl shadow-black/20"
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
							class="mb-0.5 text-lg leading-none text-warning sm:text-2xl"
							aria-label="First place"
						>
							♛
						</div>{/if}
					<div
						class="relative mx-auto grid place-items-center rounded-full border-[3px] font-black shadow-lg {isWinner
							? 'size-16 border-warning text-xl sm:size-24 sm:text-3xl'
							: 'size-13 border-secondary/70 text-base sm:size-20 sm:text-2xl'}"
						style={`background:${entry.avatar.background};color:${entry.avatar.foreground}`}
					>
						{entry.avatar.symbol}
						<span
							class="absolute -bottom-2 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-black text-text-primary ring-2 ring-bg-deep sm:size-7 sm:text-sm"
							>{entry.rank}</span
						>
					</div>
					<p class="mt-3 truncate text-sm font-black text-text-primary sm:text-lg">
						{entry.player.username}
					</p>
					<p class="text-[11px] font-bold text-secondary-hover sm:text-sm">
						{formatScore(entry.player.totalScore)} pts
					</p>
				</div>
			{/each}
		</div>
	{/if}

	<div class="min-h-0 flex-1 overflow-y-auto">
		<table class="w-full table-fixed text-left">
			<thead
				class="sticky top-0 bg-bg-deep/95 text-xs font-black tracking-[0.08em] text-text-secondary uppercase backdrop-blur-sm sm:text-sm"
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
							? 'bg-surface-hover/55'
							: 'transition hover:bg-surface-hover/30'}"
					>
						<td class="py-1 pr-1 pl-3 text-center sm:py-2">
							{#if rank <= 3}
								<span
									class="inline-grid size-7 place-items-center rounded-full text-xs font-black {rank ===
									1
										? 'bg-warning text-bg-deep'
										: rank === 2
											? 'bg-disabled text-text-primary'
											: 'bg-warning/20 text-warning'}">{rank}</span
								>
							{:else}
								<span class="text-sm font-bold text-text-secondary">{rank}</span>
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
									<span
										class="block min-w-0 truncate text-sm font-black text-text-primary sm:text-base"
										>{player.username}</span
									>
									{#if player.username === currentUser}<span
											class="ml-1 shrink-0 rounded-full bg-primary px-1 py-0 text-[10px] font-black text-text-primary"
											>You</span
										>{/if}
								</div>
							</div>
						</td>
						<td
							class="py-1 pr-[10px] pl-0 text-right text-[13px] font-black whitespace-nowrap text-text-primary sm:py-2 sm:pr-5 sm:text-base"
							>{formatScore(player.totalScore)} pts</td
						>
					</tr>
				{:else}
					<tr>
						<td
							colspan="3"
							class="type-body px-6 py-12 text-center font-semibold text-text-secondary"
						>
							No completed quiz attempts yet. Be the first learner on the board!
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if total > 0}
		<footer
			class="flex shrink-0 items-center justify-between border-t border-border px-3 py-2 sm:px-6 sm:py-3"
		>
			<p class="type-caption font-bold text-text-secondary">
				Page {page} of {totalPages}
			</p>
			<div class="flex gap-2">
				<button
					onclick={onPrevious}
					disabled={!hasPrevious}
					class="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm font-bold text-text-secondary transition hover:bg-surface-hover hover:text-text-primary disabled:border-disabled disabled:text-disabled"
					>Previous</button
				>
				<button
					onclick={onNext}
					disabled={!hasNext}
					class="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm font-bold text-text-secondary transition hover:bg-surface-hover hover:text-text-primary disabled:border-disabled disabled:text-disabled"
					>Next</button
				>
			</div>
		</footer>
	{/if}
</section>
