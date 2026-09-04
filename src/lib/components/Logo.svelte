<script lang="ts">
	let { compact = false, light = false }: { compact?: boolean; light?: boolean } = $props();
</script>

<div class="flex items-center gap-3">
	<div
		class="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9273e] text-lg font-black text-white shadow-sm"
	>
		日
	</div>
	{#if !compact}
		<div class="leading-tight">
			<p class="text-lg font-black tracking-tight {light ? 'text-white' : 'text-[#102a43]'}">
				Japanese Quest
			</p>
			<p
				class="text-[10px] font-bold tracking-[0.2em] uppercase {light
					? 'text-blue-200/60'
					: 'text-slate-400'}"
			>
				JLPT Learning
			</p>
		</div>
	{/if}
</div>
