<script lang="ts">
	let { label = 'Loading' }: { label?: string } = $props()
</script>

<div class="grid min-h-screen place-items-center bg-[#071e3b]" role="status" aria-label={label}>
	<div class="size-8 animate-spin rounded-full border-4 border-white/15 border-t-[#e52f46]"></div>
	<span class="sr-only">{label}</span>
</div>
