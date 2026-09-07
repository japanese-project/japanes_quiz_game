<script lang="ts">
	import { onMount } from 'svelte'
	import Dashboard from '$lib/components/Dashboard.svelte'
	import LoginScreen from '$lib/components/LoginScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import ResultScreen from '$lib/components/ResultScreen.svelte'
	import { questions } from '$lib/data/questions'
	import type { Level, Screen, UserProgress } from '$lib/types'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const emptyProgress = (): UserProgress => ({
		N4: { score: 0, answered: 0, best: 0 },
		N3: { score: 0, answered: 0, best: 0 },
	})
	type UserProfiles = Record<string, UserProgress>

	// svelte-ignore state_referenced_locally
	let screen = $state<Screen>(data.user ? 'dashboard' : 'login')
	// svelte-ignore state_referenced_locally
	let username = $state(data.user?.username ?? '')
	let selectedLevel = $state<Level>('N4')
	let progress = $state<UserProgress>(emptyProgress())
	let profiles = $state<UserProfiles>({})
	let ready = $state(false)
	let activeQuestions = $derived(questions.filter((question) => question.level === selectedLevel))
	let rankings = $derived(
		Object.entries(profiles)
			.map(([name, userProgress]) => {
				const score = userProgress.N4.score + userProgress.N3.score
				const answered = userProgress.N4.answered + userProgress.N3.answered
				return {
					username: name,
					totalScore: score,
					answered,
					accuracy: answered ? Math.round((score / (answered * 10)) * 100) : 0,
				}
			})
			.sort((a, b) => b.totalScore - a.totalScore || b.accuracy - a.accuracy),
	)

	onMount(() => {
		try {
			const savedProfiles = localStorage.getItem('jq-users')
			const savedProgress = localStorage.getItem('jq-progress')
			if (savedProfiles) profiles = JSON.parse(savedProfiles) as UserProfiles
			if (username) {
				progress =
					profiles[username] ??
					(savedProgress ? (JSON.parse(savedProgress) as UserProgress) : emptyProgress())
				loadProfile(username)
			}
		} catch {
			progress = emptyProgress()
			profiles = {}
		}
		ready = true
	})

	function loadProfile(name: string) {
		progress = profiles[name] ?? emptyProgress()
		profiles = { ...profiles, [name]: progress }
		localStorage.setItem('jq-users', JSON.stringify(profiles))
	}

	async function login(name: string) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: name }),
		}).catch(() => null)

		if (!response) {
			return 'Could not reach the server. Please check your connection.'
		}

		if (!response.ok) {
			const body = (await response.json().catch(() => null)) as { message?: string } | null
			return body?.message ?? 'Could not sign in. Please try again.'
		}

		const { user } = (await response.json()) as { user: { id: string; username: string } }
		username = user.username
		loadProfile(user.username)
		screen = 'dashboard'
		return null
	}

	async function logout() {
		// Leave the user signed in if the server still holds the session, so a reload cannot
		// silently restore a session the UI already discarded.
		const response = await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
		if (!response?.ok) return

		username = ''
		progress = emptyProgress()
		screen = 'login'
	}

	function startQuiz(level: Level) {
		selectedLevel = level
		screen = 'quiz'
	}

	function finishQuiz(score: number) {
		const oldLevel = progress[selectedLevel]
		progress = {
			...progress,
			[selectedLevel]: {
				score: oldLevel.score + score,
				answered: oldLevel.answered + activeQuestions.length,
				best: Math.max(oldLevel.best, score),
			},
		}
		profiles = { ...profiles, [username]: progress }
		localStorage.setItem('jq-users', JSON.stringify(profiles))
		localStorage.setItem('jq-progress', JSON.stringify(progress))
		screen = 'result'
	}
</script>

<svelte:head>
	<title>Japanese Quest | JLPT Quiz</title>
	<meta
		name="description"
		content="Practice JLPT N4 and N3 vocabulary, kanji, and grammar with interactive Japanese quizzes."
	/>
</svelte:head>

{#if ready}
	{#if screen === 'login'}
		<LoginScreen onLogin={login} />
	{:else}
		{#if screen === 'dashboard'}
			<Dashboard {username} {rankings} onStart={startQuiz} onLogout={logout} />
		{:else if screen === 'quiz'}
			<QuizScreen
				level={selectedLevel}
				questions={activeQuestions}
				onFinish={finishQuiz}
				onExit={() => (screen = 'dashboard')}
			/>
		{:else}
			<ResultScreen
				onDashboard={() => (screen = 'dashboard')}
				onRetry={() => startQuiz(selectedLevel)}
			/>
		{/if}
	{/if}
{:else}
	<div class="grid min-h-screen place-items-center bg-[#f5f8fc]">
		<div
			class="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#173d66]"
		></div>
	</div>
{/if}
