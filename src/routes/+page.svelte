<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-4">
	<h1 class="text-3xl font-bold">Japanese Quiz Game</h1>

	{#if data.user}
		<p class="text-lg">
			Welcome back, <span class="font-semibold">{data.user.username}</span>!
		</p>
		<form method="POST" action="?/logout">
			<button type="submit" class="text-sm text-gray-500 underline">Log out</button>
		</form>
	{:else}
		<form method="POST" action="?/login" class="flex w-full flex-col gap-3">
			<label for="username" class="text-sm font-medium">Enter a username to start playing</label>
			<input
				id="username"
				name="username"
				type="text"
				required
				class="rounded border px-3 py-2"
				placeholder="e.g. sakura123"
			/>
			{#if form?.error}
				<p class="text-sm text-red-600">{form.error}</p>
			{/if}
			<button type="submit" class="rounded bg-black px-4 py-2 text-white"> Start </button>
		</form>
	{/if}
</div>
