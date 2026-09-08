<script lang="ts">
	import { onMount } from 'svelte'
	import Dashboard from '$lib/components/Dashboard.svelte'
	import LoginScreen from '$lib/components/LoginScreen.svelte'
	import CategoryScreen from '$lib/components/CategoryScreen.svelte'
	import ModeScreen from '$lib/components/ModeScreen.svelte'
	import QuizScreen from '$lib/components/QuizScreen.svelte'
	import ResultScreen from '$lib/components/ResultScreen.svelte'
	import { fetch_quiz, fetch_quizzes } from '$lib/api/quizzes'
	import { round_size, type RoundMode } from '$lib/quiz_config'
	import type { Level, Quiz, QuizSummary, Screen, UserProgress } from '$lib/types'
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
	let level_quizzes = $state<QuizSummary[]>([])
	let active_quiz = $state<Quiz | null>(null)
	let selected_quiz = $state<QuizSummary | null>(null)
	let active_round = $state<{ quiz_id: string; limit: number } | null>(null)
	let loading = $state(false)
	let load_error = $state('')
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

	async function startQuiz(level: Level) {
		selectedLevel = level
		loading = true
		load_error = ''

		try {
			level_quizzes = await fetch_quizzes(level)
			screen = 'category'
		} catch (thrown) {
			load_error = thrown instanceof Error ? thrown.message : 'Could not load quizzes.'
		} finally {
			loading = false
		}
	}

	function select_quiz(quiz: QuizSummary) {
		selected_quiz = quiz
		screen = 'mode'
	}

	async function start_round(mode: RoundMode) {
		if (!selected_quiz) return
		await load_quiz(selected_quiz.id, round_size(mode, selected_quiz.question_count))
	}

	// Refetches rather than replaying the cached questions, so a retry draws a new sample
	// at the same length the player originally chose.
	async function retry_quiz() {
		if (active_round) await load_quiz(active_round.quiz_id, active_round.limit)
	}

	async function load_quiz(quiz_id: string, limit: number) {
		loading = true
		load_error = ''

		try {
			active_quiz = await fetch_quiz(quiz_id, limit)
			active_round = { quiz_id, limit }
			screen = 'quiz'
		} catch (thrown) {
			load_error = thrown instanceof Error ? thrown.message : 'Could not load that quiz.'
		} finally {
			loading = false
		}
	}

	function finishQuiz(score: number) {
		const oldLevel = progress[selectedLevel]
		progress = {
			...progress,
			[selectedLevel]: {
				score: oldLevel.score + score,
				answered: oldLevel.answered + (active_quiz?.questions.length ?? 0),
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
		{:else if screen === 'category'}
			<CategoryScreen
				level={selectedLevel}
				quizzes={level_quizzes}
				on_select={select_quiz}
				on_back={() => (screen = 'dashboard')}
			/>
		{:else if screen === 'mode' && selected_quiz}
			<ModeScreen
				quiz={selected_quiz}
				on_start={start_round}
				on_back={() => (screen = 'category')}
			/>
		{:else if screen === 'quiz' && active_quiz}
			<QuizScreen
				quiz={active_quiz}
				on_finish={finishQuiz}
				on_exit={() => (screen = 'dashboard')}
			/>
		{:else}
			<ResultScreen
				onDashboard={() => (screen = 'dashboard')}
				onRetry={() => (active_round ? retry_quiz() : startQuiz(selectedLevel))}
			/>
		{/if}

		{#if loading}
			<div class="fixed inset-0 grid place-items-center bg-[#071e3b]/70">
				<div class="size-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
			</div>
		{/if}

		{#if load_error}
			<div
				class="fixed inset-x-0 bottom-6 mx-auto w-fit rounded-xl border border-red-400/40 bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg"
			>
				{load_error}
			</div>
		{/if}
	{/if}
{:else}
	<div class="grid min-h-screen place-items-center bg-[#f5f8fc]">
		<div
			class="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#173d66]"
		></div>
	</div>
{/if}
