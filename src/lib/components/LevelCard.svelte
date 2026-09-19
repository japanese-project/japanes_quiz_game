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
	class="group overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-[#1b3657]/95 to-[#142e4e]/95 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-white/25 hover:shadow-black/25 max-sm:h-full max-sm:rounded-2xl"
>
	<div class="h-2 max-sm:h-1.5" style={`background:${color}`}></div>
	<div
		class="flex min-h-[350px] flex-col p-6 max-sm:h-[calc(100%-0.375rem)] max-sm:min-h-0 max-sm:p-4 sm:p-7"
	>
		<div class="flex items-center gap-5 max-sm:gap-3">
			<div
				class="grid size-16 shrink-0 place-items-center rounded-full text-xl font-black shadow-sm max-sm:size-12 max-sm:text-lg {level ===
				'N4'
					? 'text-[#08243d]'
					: 'text-white'}"
				style={`background:${color}`}
			>
				{level}
			</div>
			<div>
				<span
					class="type-label rounded-full px-3 py-1.5 font-black tracking-wide max-sm:py-1"
					style={`background:${color}22;color:${color}`}>{tag}</span
				>
				<h3 class="type-h3 mt-3 font-black tracking-tight text-white max-sm:mt-2">{label}</h3>
				<p class="type-caption mt-2 font-medium text-blue-100/60 max-sm:mt-1">
					{level} · {subtitle}
				</p>
			</div>
		</div>
		<p
			class="type-body mt-8 leading-7 text-blue-100/65 max-sm:mt-4 max-sm:line-clamp-2 max-sm:leading-6"
		>
			{description}
		</p>
		<div
			class="mt-6 flex flex-wrap gap-2.5 max-sm:mt-4 max-sm:grid max-sm:grid-cols-3 max-sm:gap-2"
		>
			{#each ['Vocabulary', 'Kanji', 'Grammar'] as subject (subject)}
				<span
					class="type-caption rounded-full bg-white/[0.05] px-4 py-2 text-center font-bold text-blue-100/65 max-sm:px-2 max-sm:py-2"
					>{subject}</span
				>
			{/each}
		</div>
		<div
			class="mt-auto flex items-center justify-between gap-3 border-t border-white/15 pt-6 max-sm:pt-3"
		>
			<span class="type-caption font-medium text-blue-100/65 max-sm:max-w-24"
				>Choose difficulty</span
			>
			<button
				onclick={() => onStart(level)}
				class="type-action flex cursor-pointer items-center gap-3 rounded-full bg-[#e52f46] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#f13b51] hover:shadow-lg max-sm:px-5 max-sm:py-2.5"
				>Start Quiz <Icon name="arrow" size={17} /></button
			>
		</div>
	</div>
</article>
