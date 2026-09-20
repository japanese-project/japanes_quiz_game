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
	class="group overflow-hidden rounded-[2rem] border border-border bg-gradient-to-b from-surface to-bg-deep shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-border hover:from-surface-hover hover:to-surface hover:shadow-black/25 max-sm:h-full max-sm:rounded-[1.4rem] max-sm:bg-surface max-sm:shadow-lg"
>
	<div class="hidden h-2 sm:block" style={`background:${color}`}></div>

	<div class="grid h-full grid-cols-[92px_1fr] sm:hidden">
		<div
			class="relative grid place-items-center overflow-hidden border-r border-border"
			style={`background:linear-gradient(155deg, color-mix(in srgb, ${color} 26%, transparent), color-mix(in srgb, ${color} 7%, transparent))`}
		>
			<div
				class="absolute -top-8 -left-8 size-24 rounded-full opacity-20"
				style={`background:${color}`}
			></div>
			<div
				class="absolute -right-6 -bottom-8 size-20 rounded-full opacity-15"
				style={`background:${color}`}
			></div>
			<div class="relative text-center">
				<div
					class="grid size-14 place-items-center rounded-2xl border border-border text-xl font-black shadow-lg {level ===
					'N4'
						? 'text-bg-deep'
						: 'text-text-primary'}"
					style={`background:${color}`}
				>
					{level}
				</div>
				<p class="mt-2 text-[10px] font-black tracking-[0.16em] text-text-secondary uppercase">
					JLPT
				</p>
			</div>
		</div>

		<div class="flex min-w-0 flex-col p-4">
			<div class="flex items-start justify-between gap-2">
				<div class="min-w-0">
					<span
						class="inline-flex rounded-full px-2.5 py-1 text-[11px] leading-none font-black"
						style={`background:color-mix(in srgb, ${color} 13%, transparent);color:${color}`}
						>{tag}</span
					>
					<h3
						class="mt-2 truncate text-[18px] leading-tight font-black tracking-tight text-text-primary"
					>
						{label}
					</h3>
					<p class="mt-1 text-[12px] font-medium text-text-secondary">{level} · {subtitle}</p>
				</div>
			</div>

			<button
				onclick={() => onStart(level)}
				class="mt-auto flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-[14px] font-black text-text-primary shadow-md transition active:scale-[0.98]"
				style={`background:${color}`}
			>
				<span>Start Quiz</span>
				<span class="grid size-6 place-items-center rounded-lg bg-text-primary/15">
					<Icon name="arrow" size={14} />
				</span>
			</button>
		</div>
	</div>

	<div class="hidden min-h-[350px] flex-col p-6 sm:flex sm:p-7 md:max-lg:p-5">
		<div class="flex items-center gap-5">
			<div
				class="grid size-16 shrink-0 place-items-center rounded-full text-xl font-black shadow-sm {level ===
				'N4'
					? 'text-bg-deep'
					: 'text-text-primary'}"
				style={`background:${color}`}
			>
				{level}
			</div>
			<div>
				<span
					class="type-label rounded-full px-3 py-1.5 font-black tracking-wide"
					style={`background:color-mix(in srgb, ${color} 13%, transparent);color:${color}`}
					>{tag}</span
				>
				<h3 class="type-h3 mt-3 font-black tracking-tight text-text-primary">{label}</h3>
				<p class="type-caption mt-2 font-medium text-text-secondary">
					{level} · {subtitle}
				</p>
			</div>
		</div>
		<p class="type-body mt-8 leading-7 text-text-secondary">
			{description}
		</p>
		<div class="mt-6 flex flex-wrap gap-2.5">
			{#each ['Vocabulary', 'Kanji', 'Grammar'] as subject (subject)}
				<span
					class="type-caption rounded-full bg-surface-hover/45 px-4 py-2 text-center font-bold text-text-secondary"
					>{subject}</span
				>
			{/each}
		</div>
		<div class="mt-auto flex items-center justify-between gap-3 pt-6">
			<span class="type-caption font-medium text-text-secondary">Choose difficulty</span>
			<button
				onclick={() => onStart(level)}
				class="type-action flex shrink-0 cursor-pointer items-center gap-3 rounded-full bg-primary px-6 py-3 font-bold whitespace-nowrap text-text-primary shadow-sm transition hover:bg-primary-hover hover:shadow-lg md:max-lg:px-4"
				>Start Quiz <Icon name="arrow" size={17} /></button
			>
		</div>
	</div>
</article>
