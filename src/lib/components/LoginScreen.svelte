<script lang="ts">
	import Icon from './Icon.svelte'
	import patternBackground from '$lib/assets/pattern1.png'
	import animalAvatars from '$lib/data/animal-avatars.json'

	let { onLogin }: { onLogin: (username: string, avatarId: string) => Promise<string | null> } =
		$props()
	let username = $state('')
	let selectedAvatar = $state('')
	let step = $state<'username' | 'avatar'>('username')
	let error = $state('')
	let pending = $state(false)

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		const cleanName = username.trim()
		if (cleanName.length < 2) {
			error = 'Please enter a username with at least 2 characters.'
			step = 'username'
			return
		}
		if (step === 'username') {
			error = ''
			step = 'avatar'
			return
		}
		if (!selectedAvatar) {
			error = 'Please choose an animal avatar.'
			return
		}
		pending = true
		error = (await onLogin(cleanName, selectedAvatar)) ?? ''
		pending = false
	}

	function editUsername() {
		error = ''
		step = 'username'
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/quest-mascot.png" />
</svelte:head>

<main
	class="app-pattern-bg flex min-h-screen items-center justify-center overflow-x-hidden bg-cover bg-fixed bg-center bg-no-repeat px-5 py-4 sm:px-8 sm:py-10"
	style={`--pattern-image:url('${patternBackground}')`}
>
	<section class="w-full max-w-[500px] px-2 sm:px-8">
		<div class="flex items-center justify-center gap-3">
			<div
				class="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-text-primary shadow-sm"
			>
				日
			</div>
			<div class="leading-tight">
				<p class="text-lg font-black tracking-tight text-text-primary">Japanese Quest</p>
				<p class="type-caption font-bold tracking-[0.22em] text-text-secondary">JLPT LEARNING</p>
			</div>
		</div>

		<div class="mx-auto mt-3 grid h-36 place-items-center sm:mt-5 sm:h-72">
			<img
				src="/images/quest-mascot.png"
				alt="A cheerful purple Japanese Quest mascot"
				class="w-40 drop-shadow-2xl select-none sm:w-72"
			/>
		</div>

		<form onsubmit={submit} class="mt-3">
			{#if step === 'username'}
				<label class="block">
					<span class="type-label mb-2 block font-black tracking-wide text-text-primary uppercase"
						>Username</span
					>
					<div
						class="flex items-center gap-3 rounded-xl border bg-surface px-4 transition focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20 {error
							? 'border-error'
							: 'border-border'}"
					>
						<span class="text-text-secondary"><Icon name="user" size={19} /></span>
						<input
							bind:value={username}
							oninput={() => (error = '')}
							disabled={pending}
							maxlength="24"
							autocomplete="username"
							placeholder="e.g. Sakura"
							aria-describedby={error ? 'login-error' : undefined}
							class="type-body h-14 w-full bg-transparent font-medium text-text-primary outline-none placeholder:font-normal placeholder:text-text-secondary"
						/>
					</div>
				</label>
			{:else}
				<fieldset>
					<legend class="w-full text-center">
						<span class="type-h3 block font-black text-text-primary">Hello, {username.trim()}!</span
						>
						<span class="type-caption mt-1 block font-bold text-text-secondary"
							>Choose your animal avatar</span
						>
					</legend>
					<div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
						{#each animalAvatars as avatar (avatar.id)}
							<button
								type="button"
								onclick={() => {
									selectedAvatar = avatar.id
									error = ''
								}}
								aria-pressed={selectedAvatar === avatar.id}
								class="group flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-xl border text-text-primary transition {selectedAvatar ===
								avatar.id
									? 'border-secondary bg-secondary/15 ring-2 ring-secondary/30'
									: 'border-border bg-surface hover:border-secondary/60 hover:bg-surface-hover'}"
							>
								<span class="text-3xl leading-none" aria-hidden="true">{avatar.emoji}</span>
								<span
									class="mt-1 text-[10px] font-bold text-text-secondary group-hover:text-text-primary"
									>{avatar.name}</span
								>
							</button>
						{/each}
					</div>
				</fieldset>
			{/if}
			{#if error}<p id="login-error" class="type-caption mt-2 text-center font-semibold text-error">
					{error}
				</p>{/if}
			<button
				type="submit"
				disabled={pending || (step === 'avatar' && !selectedAvatar)}
				class="type-action mt-4 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary font-black text-text-primary shadow-lg shadow-black/20 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled"
				>{step === 'username' ? 'Continue' : pending ? 'Signing in...' : 'Start Learning'}
				<Icon name="arrow" size={18} /></button
			>
			{#if step === 'avatar'}
				<button
					type="button"
					onclick={editUsername}
					class="type-caption mx-auto mt-3 block cursor-pointer font-bold text-text-secondary transition hover:text-text-primary"
					>← Change username</button
				>
			{/if}
		</form>

		<div
			class="type-caption mt-5 flex items-center justify-center gap-5 font-bold text-text-secondary"
		>
			<span class="flex items-center gap-1.5"
				><span class="size-1.5 rounded-full bg-primary"></span>N4 & N3</span
			>
			<span class="flex items-center gap-1.5"
				><span class="size-1.5 rounded-full bg-primary"></span>Progress saved</span
			>
		</div>
	</section>
</main>
