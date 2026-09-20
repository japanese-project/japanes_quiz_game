<script lang="ts">
	let { compact = false, light = false }: { compact?: boolean; light?: boolean } = $props()
</script>

<div class="flex items-center gap-3">
	<div
		class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-lg font-black text-text-primary shadow-sm"
	>
		日
	</div>
	{#if !compact}
		<div class="leading-tight">
			<p class="text-lg font-black tracking-tight {light ? 'text-text-primary' : 'text-bg-deep'}">
				Japanese Quest
			</p>
			<p
				class="type-caption font-bold tracking-[0.2em] uppercase {light
					? 'text-text-secondary'
					: 'text-disabled'}"
			>
				JLPT Learning
			</p>
		</div>
	{/if}
</div>
