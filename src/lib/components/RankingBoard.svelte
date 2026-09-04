<script lang="ts">
	import Icon from './Icon.svelte';

	type Ranking = {
		username: string;
		totalScore: number;
		answered: number;
		accuracy: number;
	};

	let { rankings, currentUser }: { rankings: Ranking[]; currentUser: string } = $props();
</script>

<section
	class="overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/20"
>
	<div class="flex items-center justify-between border-b border-white/15 px-6 py-7 sm:px-8">
		<div class="flex items-center gap-5">
			<span class="grid size-14 shrink-0 place-items-center rounded-full bg-amber-300/15 text-amber-300">
				<Icon name="trophy" size={24} />
			</span>
			<div>
				<h2 class="text-xl font-black tracking-tight text-white">Leaderboard</h2>
				<p class="mt-1 text-sm text-blue-100/60">Learner rankings saved on this browser</p>
			</div>
		</div>
		<span class="rounded-full bg-white/[0.04] px-5 py-3 text-sm font-bold text-blue-100/60"
			>{rankings.length} learners</span
		>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full min-w-[420px] text-left">
			<thead class="bg-[#142d4c]/80 text-xs font-black tracking-[0.16em] text-blue-100/60 uppercase">
				<tr>
					<th class="w-28 px-6 py-5 text-center sm:px-8">Rank</th>
					<th class="px-4 py-5">User</th>
					<th class="px-6 py-5 text-right sm:px-8">Total score</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/10">
				{#each rankings as player, index (player.username)}
					<tr
						class={player.username === currentUser
							? 'bg-[#24577f]/55'
							: 'transition hover:bg-white/5'}
					>
						<td class="px-6 py-5 text-center sm:px-8">
							{#if index < 3}
								<span
									class="inline-grid size-10 place-items-center rounded-full text-sm font-black {index ===
									0
										? 'bg-amber-300 text-[#102a43]'
										: index === 1
											? 'bg-blue-100/35 text-blue-50'
											: 'bg-orange-100 text-orange-700'}">{index + 1}</span
								>
							{:else}
								<span class="text-sm font-bold text-blue-100/55">{index + 1}</span>
							{/if}
						</td>
						<td class="px-4 py-5">
							<div class="flex items-center gap-3">
								<span
									class="grid size-10 place-items-center rounded-full bg-[#1a3150] text-sm font-black text-blue-50"
									>{player.username.slice(0, 1).toUpperCase()}</span
								>
								<div>
									<span class="text-sm font-black text-blue-50">{player.username}</span
									>{#if player.username === currentUser}<span
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
				{/each}
			</tbody>
		</table>
	</div>
</section>
