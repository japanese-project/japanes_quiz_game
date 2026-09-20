<script lang="ts">
	let { label = 'Loading' }: { label?: string } = $props()
</script>

<div class="grid min-h-screen place-items-center bg-bg-primary" role="status" aria-label={label}>
	<div class="size-8 animate-spin rounded-full border-4 border-disabled/35 border-t-primary"></div>
	<span class="sr-only">{label}</span>
</div>
