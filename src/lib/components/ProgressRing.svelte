<script lang="ts">
	let { value, size = 112 }: { value: number; size?: number } = $props();
	const radius = 45;
	const circumference = 2 * Math.PI * radius;
	let dash = $derived((circumference * Math.min(100, Math.max(0, value))) / 100);
</script>

<div class="relative grid place-items-center" style={`width:${size}px;height:${size}px`}>
	<svg viewBox="0 0 104 104" class="size-full -rotate-90">
		<circle cx="52" cy="52" r={radius} fill="none" stroke="#e8eef5" stroke-width="7" />
		<circle
			cx="52"
			cy="52"
			r={radius}
			fill="none"
			stroke="#c9273e"
			stroke-width="7"
			stroke-linecap="round"
			stroke-dasharray={`${dash} ${circumference - dash}`}
		/>
	</svg>
	<div class="absolute text-center">
		<span class="text-2xl font-black text-[#102a43]">{value}%</span><span
			class="block text-[10px] font-bold tracking-wide text-slate-400">PROGRESS</span
		>
	</div>
</div>
