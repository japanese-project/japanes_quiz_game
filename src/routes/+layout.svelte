<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { playThemeMusic, resumeDesiredMusic, stopAllAudio } from '$lib/client/audio'
	import './layout.css'
	import favicon from '$lib/assets/favicon.svg'

	let { children } = $props()

	$effect(() => {
		const pathname = page.url.pathname
		if (pathname === '/') {
			stopAllAudio()
		} else if (!pathname.startsWith('/quiz/')) {
			playThemeMusic()
		}
	})

	onMount(() => {
		const resume = () => resumeDesiredMusic()
		window.addEventListener('pointerdown', resume)
		window.addEventListener('keydown', resume)

		return () => {
			window.removeEventListener('pointerdown', resume)
			window.removeEventListener('keydown', resume)
			stopAllAudio()
		}
	})
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
