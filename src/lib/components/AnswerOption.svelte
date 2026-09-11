<script lang="ts">
	import Icon from './Icon.svelte'

	let {
		choice,
		index,
		answer,
		selected,
		submitted,
		onSelect,
	}: {
		choice: string
		index: number
		answer: number
		selected: number | null
		submitted: boolean
		onSelect: (index: number) => void
	} = $props()

	let isCorrect = $derived(submitted && index === answer)
	let isWrong = $derived(submitted && selected === index && index !== answer)
</script>

<button
	onclick={() => onSelect(index)}
	disabled={submitted}
	class="flex min-h-16 items-center gap-3 rounded-xl border-2 px-4 text-left text-sm font-bold transition {isCorrect
		? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-950/25'
		: isWrong
			? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-950/25'
			: selected === index
				? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
				: 'border-white/15 bg-white/[0.03] text-blue-100/75 hover:border-white/30 hover:bg-white/[0.07]'}"
>
	<span
		class="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0a2440] text-xs font-black text-blue-100 ring-1 ring-white/10"
		>{String.fromCharCode(65 + index)}</span
	>
	{choice}
	{#if isCorrect}
		<span class="ml-auto"><Icon name="check" size={19} /></span>
	{:else if isWrong}
		<span class="ml-auto"><Icon name="x" size={19} /></span>
	{/if}
</button>
