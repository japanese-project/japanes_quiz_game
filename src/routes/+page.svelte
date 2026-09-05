<script lang="ts">
	import { onMount } from 'svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import LoginScreen from '$lib/components/LoginScreen.svelte';
	import QuizScreen from '$lib/components/QuizScreen.svelte';
	import ResultScreen from '$lib/components/ResultScreen.svelte';
	import { questions } from '$lib/data/questions';
	import type { Level, Screen, UserProgress } from '$lib/types';

	const emptyProgress = (): UserProgress => ({
		N4: { score: 0, answered: 0, best: 0 },
		N3: { score: 0, answered: 0, best: 0 }
	});
	type UserProfiles = Record<string, UserProgress>;

	let screen = $state<Screen>('login');
	let username = $state('');
	let selectedLevel = $state<Level>('N4');
	let progress = $state<UserProgress>(emptyProgress());
	let profiles = $state<UserProfiles>({});
	let ready = $state(false);
	let activeQuestions = $derived(questions.filter((question) => question.level === selectedLevel));
	let rankings = $derived(
		Object.entries(profiles)
			.map(([name, userProgress]) => {
				const score = userProgress.N4.score + userProgress.N3.score;
				const answered = userProgress.N4.answered + userProgress.N3.answered;
				return {
					username: name,
					totalScore: score,
					answered,
					accuracy: answered ? Math.round((score / (answered * 10)) * 100) : 0
				};
			})
			.sort((a, b) => b.totalScore - a.totalScore || b.accuracy - a.accuracy)
	);

	onMount(() => {
		try {
			const savedName = localStorage.getItem('jq-username');
			const savedProfiles = localStorage.getItem('jq-users');
			const savedProgress = localStorage.getItem('jq-progress');
			if (savedProfiles) profiles = JSON.parse(savedProfiles) as UserProfiles;
			if (savedName) {
				username = savedName;
				if (profiles[savedName]) {
					progress = profiles[savedName];
				} else {
					progress = savedProgress ? (JSON.parse(savedProgress) as UserProgress) : emptyProgress();
					profiles = { ...profiles, [savedName]: progress };
					localStorage.setItem('jq-users', JSON.stringify(profiles));
				}
				screen = 'dashboard';
			}
		} catch {
			progress = emptyProgress();
			profiles = {};
		}
		ready = true;
	});

	function login(name: string) {
		username = name;
		progress = profiles[name] ?? emptyProgress();
		profiles = { ...profiles, [name]: progress };
		localStorage.setItem('jq-username', name);
		localStorage.setItem('jq-users', JSON.stringify(profiles));
		screen = 'dashboard';
	}

	function logout() {
		localStorage.removeItem('jq-username');
		username = '';
		screen = 'login';
	}

	function startQuiz(level: Level) {
		selectedLevel = level;
		screen = 'quiz';
	}

	function finishQuiz(score: number) {
		const oldLevel = progress[selectedLevel];
		progress = {
			...progress,
			[selectedLevel]: {
				score: oldLevel.score + score,
				answered: oldLevel.answered + activeQuestions.length,
				best: Math.max(oldLevel.best, score)
			}
		};
		profiles = { ...profiles, [username]: progress };
		localStorage.setItem('jq-users', JSON.stringify(profiles));
		localStorage.setItem('jq-progress', JSON.stringify(progress));
		screen = 'result';
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
