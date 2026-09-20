<script lang="ts">
	let {
		id,
		name,
		role,
		image,
	}: {
		id: number
		name: string
		role: string
		image: string
	} = $props()

	const initials = $derived(
		name
			.split(' ')
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase(),
	)
</script>

<section
	class="h-[520px] overflow-hidden rounded-[2rem] border border-border bg-text-primary text-left shadow-2xl shadow-black/20 sm:h-[560px]"
>
	<div class="relative h-[72%] overflow-hidden bg-text-secondary">
		{#if image}
			<img
				src={image}
				alt={name}
				class="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.025]"
			/>
		{:else}
			<div class="grid h-full place-items-center bg-gradient-to-br from-surface to-bg-deep">
				<span class="text-7xl font-black text-text-primary">{initials}</span>
			</div>
		{/if}
		<div
			class="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-bg-deep/10"
		></div>
		<span
			class="type-caption absolute top-5 left-5 rounded-full border border-border bg-bg-deep/70 px-5 py-2.5 font-mono font-black tracking-[0.22em] text-text-primary backdrop-blur-md"
		>
			{String(id).padStart(2, '0')}
		</span>
		<span
			class="type-caption absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] rounded-full border border-border bg-bg-deep/75 px-5 py-2.5 font-black text-text-primary backdrop-blur-md"
		>
			{role}
		</span>
	</div>

	<div class="flex h-[28%] items-center px-7 py-5 sm:px-8">
		<h2 class="type-h2 font-black tracking-tight text-bg-deep">{name}</h2>
	</div>
</section>
