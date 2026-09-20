<script lang="ts">
	import Icon from './Icon.svelte'
	import type { Choice } from '$lib/types'

	let {
		choice,
		index,
		selected,
		correct_choice_id,
		submitted,
		checking,
		onSelect,
	}: {
		choice: Choice
		index: number
		selected: string | null
		correct_choice_id: string | null
		submitted: boolean
		checking: boolean
		onSelect: (choice_id: string) => void
	} = $props()

	let isSelected = $derived(selected === choice.id)
	let isCorrect = $derived(submitted && choice.id === correct_choice_id)
	let isWrong = $derived(submitted && isSelected && !isCorrect)
</script>

<button
	onclick={() => onSelect(choice.id)}
	disabled={submitted || checking}
	class="type-action flex min-h-16 items-center gap-3 rounded-xl border-2 px-4 text-left font-bold transition {isCorrect
		? 'border-success bg-success/15 text-text-primary shadow-lg shadow-black/20'
		: isWrong
			? 'border-error bg-error/15 text-text-primary shadow-lg shadow-black/20'
			: isSelected
				? 'border-secondary bg-secondary/10 text-text-primary'
				: 'border-border bg-bg-deep/35 text-text-secondary hover:border-secondary/60 hover:bg-surface-hover'}"
>
	<span
		class="type-label grid size-8 shrink-0 place-items-center rounded-lg bg-bg-deep font-black text-text-primary ring-1 ring-border"
		>{String.fromCharCode(65 + index)}</span
	>
	{choice.text}
	{#if isCorrect}
		<span class="ml-auto"><Icon name="check" size={19} /></span>
	{:else if isWrong}
		<span class="ml-auto"><Icon name="x" size={19} /></span>
	{/if}
</button>
