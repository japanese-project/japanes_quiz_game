<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types'
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
</script>

<section
	class="overflow-hidden rounded-4xl border border-white/15 bg-linear-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/20"
>
	<div class="flex items-center justify-between border-b border-white/15 px-6 py-7 sm:px-8">
		<div class="flex items-center gap-5">
			<span
				class="grid size-14 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-300"
			>
				<Icon name="trophy" size={24} />
			</span>
			<div>
				<h2 class="text-xl font-black tracking-tight text-white">Leaderboard</h2>
				<p class="mt-1 text-sm text-blue-100/60">Shared learner rankings, updated live</p>
			</div>
		</div>
		<span class="rounded-full bg-white/4 px-5 py-3 text-sm font-bold text-blue-100/60"
			>{total} learners</span
		>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full min-w-105 text-left">
			<thead
				class="bg-[#142d4c]/80 text-xs font-black tracking-[0.16em] text-blue-100/60 uppercase"
			>
				<tr>
					<th class="w-28 px-6 py-5 text-center sm:px-8">Rank</th>
					<th class="px-4 py-5">User</th>
					<th class="px-6 py-5 text-right sm:px-8">Total score</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/10">
				{#each rankings as player, index (player.username)}
					{@const rank = (page - 1) * 10 + index + 1}
					<tr
						class={player.username === currentUser
							? 'bg-[#24577f]/55'
							: 'transition hover:bg-white/5'}
					>
						<td class="px-6 py-5 text-center sm:px-8">
							{#if rank <= 3}
								<span
									class="inline-grid size-10 place-items-center rounded-full text-sm font-black {rank ===
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
						<td class="px-4 py-5">
							<div class="flex items-center gap-3">
								<span
									class="grid size-10 place-items-center rounded-full bg-[#1a3150] text-sm font-black text-blue-50"
									>{player.username.slice(0, 1).toUpperCase()}</span
								>
								<div>
									<span class="text-sm font-black text-blue-50">{player.username}</span>
									{#if player.username === currentUser}<span
											class="ml-2 rounded-full bg-[#c9273e] px-2 py-0.5 text-[9px] font-black text-white"
											>You</span
										>{/if}
								</div>
							</div>
						</td>
						<td class="px-6 py-5 text-right text-base font-black text-blue-50 sm:px-8"
							>{player.totalScore} pts</td
						>
					</tr>
				{:else}
					<tr>
						<td colspan="3" class="px-6 py-12 text-center text-sm font-semibold text-blue-100/65">
							No completed quiz attempts yet. Be the first learner on the board!
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if total > 0}
		<footer class="flex items-center justify-between border-t border-white/10 px-6 py-5 sm:px-8">
			<p class="text-xs font-bold text-blue-100/60">
				Page {page} of {totalPages} · 10 learners per page
			</p>
			<div class="flex gap-2">
				<button
					onclick={onPrevious}
					disabled={!hasPrevious}
					class="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
					>Previous</button
				>
				<button
					onclick={onNext}
					disabled={!hasNext}
					class="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-blue-100/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
					>Next</button
				>
			</div>
		</footer>
	{/if}
</section>
