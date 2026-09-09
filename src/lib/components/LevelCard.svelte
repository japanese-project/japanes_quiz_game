<script lang="ts">
	import type { Level } from '$lib/types'
	import Icon from './Icon.svelte'

	let {
		level,
		label,
		subtitle,
		description,
		color,
		tag,
		onStart,
	}: {
		level: Level
		label: string
		subtitle: string
		description: string
		color: string
		tag: string
		onStart: (level: Level) => void
	} = $props()
</script>

<article
	class="group overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-white/25 hover:shadow-black/25"
>
	<div class="h-2" style={`background:${color}`}></div>
	<div class="flex min-h-[350px] flex-col p-6 sm:p-7">
		<div class="flex items-center gap-5">
			<div
				class="grid size-16 shrink-0 place-items-center rounded-full text-xl font-black shadow-sm {level ===
				'N4'
					? 'text-[#08243d]'
					: 'text-white'}"
				style={`background:${color}`}
			>
				{level}
			</div>
			<div>
				<span
					class="rounded-full px-3 py-1.5 text-xs font-black tracking-wide"
					style={`background:${color}22;color:${color}`}>{tag}</span
				>
				<h3 class="mt-3 text-xl font-black tracking-tight text-white">{label}</h3>
				<p class="mt-2 text-sm font-medium text-blue-100/60">{level} · {subtitle}</p>
			</div>
		</div>
		<p class="mt-8 text-sm leading-7 text-blue-100/65">{description}</p>
		<div class="mt-6 flex flex-wrap gap-2.5">
			{#each ['Vocabulary', 'Kanji', 'Grammar'] as subject (subject)}
				<span class="rounded-full bg-white/[0.05] px-4 py-2 text-xs font-bold text-blue-100/65"
					>{subject}</span
				>
			{/each}
		</div>
		<div class="mt-auto flex items-center justify-between border-t border-white/15 pt-6">
			<span class="text-sm font-medium text-blue-100/65">6 questions</span>
			<button
				onclick={() => onStart(level)}
				class="flex cursor-pointer items-center gap-3 rounded-full bg-[#e52f46] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#f13b51] hover:shadow-lg"
				>Start Quiz <Icon name="arrow" size={17} /></button
			>
		</div>
	</div>
</article>
