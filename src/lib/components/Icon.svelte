<script lang="ts">
	let { name, size = 20 }: { name: string; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'user'}<path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" />
	{:else if name === 'trophy'}<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path
			d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"
		/>
	{:else if name === 'book'}<path
			d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"
		/><path d="M8 7h8M8 11h6" />
	{:else if name === 'chart'}<path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
	{:else if name === 'arrow'}<path d="m9 18 6-6-6-6" />
	{:else if name === 'check'}<path d="m5 12 4 4L19 6" />
	{:else if name === 'x'}<path d="m6 6 12 12M18 6 6 18" />
	{:else if name === 'logout'}<path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" />
	{:else}<circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" />{/if}
</svg>
