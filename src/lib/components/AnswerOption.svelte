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
	class="flex min-h-16 items-center gap-3 rounded-xl border-2 px-4 text-left text-sm font-bold transition {isCorrect
		? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-950/25'
		: isWrong
			? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-950/25'
			: isSelected
				? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
				: 'border-white/15 bg-white/[0.03] text-blue-100/75 hover:border-white/30 hover:bg-white/[0.07]'}"
>
	<span
		class="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0a2440] text-xs font-black text-blue-100 ring-1 ring-white/10"
		>{String.fromCharCode(65 + index)}</span
	>
	{choice.text}
	{#if isCorrect}
		<span class="ml-auto"><Icon name="check" size={19} /></span>
	{:else if isWrong}
		<span class="ml-auto"><Icon name="x" size={19} /></span>
	{/if}
</button>
