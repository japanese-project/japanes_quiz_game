<script lang="ts">
	import Icon from './Icon.svelte';
	import patternBackground from '$lib/assets/pattern1.png';

	let { onLogin }: { onLogin: (username: string) => void } = $props();
	let username = $state('');
	let error = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const cleanName = username.trim();
		if (cleanName.length < 2) {
			error = 'Please enter a username with at least 2 characters.';
			return;
		}
		onLogin(cleanName);
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/quest-mascot.png" />
</svelte:head>

<main
	class="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#0d2948] bg-cover bg-fixed bg-center bg-no-repeat px-5 py-10 sm:px-8"
	style={`background-image: linear-gradient(rgba(13, 41, 72, 0.82), rgba(13, 41, 72, 0.88)), url('${patternBackground}')`}
>
	<section class="w-full max-w-[500px] px-2 sm:px-8">
		<div class="flex items-center justify-center gap-3">
			<div
				class="grid size-10 place-items-center rounded-xl bg-[#d52b45] text-lg font-black text-white shadow-sm"
			>
				日
			</div>
			<div class="leading-tight">
				<p class="text-lg font-black tracking-tight text-white">Japanese Quest</p>
				<p class="text-[10px] font-bold tracking-[0.22em] text-blue-200/70">JLPT LEARNING</p>
			</div>
		</div>

		<div class="mx-auto mt-5 grid h-60 place-items-center sm:h-72">
			<img
				src="/images/quest-mascot.png"
				alt="A cheerful purple Japanese Quest mascot"
				class="w-60 drop-shadow-2xl select-none sm:w-72"
			/>
		</div>

		<form onsubmit={submit} class="mt-3">
			<label class="block">
				<span class="mb-2 block text-xs font-black tracking-wide text-blue-100 uppercase"
					>Username</span
				>
				<div
					class="flex items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-300/20 {error
						? 'border-red-400'
						: 'border-white'}"
				>
					<span class="text-slate-400"><Icon name="user" size={19} /></span>
					<input
						bind:value={username}
						oninput={() => (error = '')}
						maxlength="24"
						autocomplete="username"
						placeholder="e.g. Sakura"
						aria-describedby={error ? 'username-error' : undefined}
						class="h-14 w-full bg-transparent text-[15px] font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
					/>
				</div>
				{#if error}<p id="username-error" class="mt-2 text-xs font-semibold text-red-300">
						{error}
					</p>{/if}
			</label>
			<button
				type="submit"
				class="mt-4 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#d52b45] text-sm font-black text-white shadow-lg shadow-black/20 transition hover:bg-[#bd2038]"
				>Start Learning <Icon name="arrow" size={18} /></button
			>
		</form>

		<div class="mt-5 flex items-center justify-center gap-5 text-[11px] font-bold text-blue-200/70">
			<span class="flex items-center gap-1.5"
				><span class="size-1.5 rounded-full bg-[#d52b45]"></span>N4 & N3</span
			>
			<span class="flex items-center gap-1.5"
				><span class="size-1.5 rounded-full bg-[#d52b45]"></span>Progress saved</span
			>
		</div>
	</section>
</main>
