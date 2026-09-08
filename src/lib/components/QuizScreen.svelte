<script lang="ts">
	import { onDestroy } from 'svelte'
	import patternBackground from '$lib/assets/pattern1.png'
	import { submit_answer } from '$lib/api/quizzes'
	import type { AnswerResult, Quiz } from '$lib/types'
	import Icon from './Icon.svelte'

	let {
		quiz,
		on_finish,
		on_exit,
	}: {
		quiz: Quiz
		on_finish: (score: number, correct: number) => void
		on_exit: () => void
	} = $props()

	let index = $state(0)
	let selected_choice_id = $state<string | null>(null)
	let result = $state<AnswerResult | null>(null)
	let error = $state('')
	let correct = $state(0)
	let advance_timer: ReturnType<typeof setTimeout> | undefined
	let current = $derived(quiz.questions[index])
	let progress = $derived(Math.round(((index + (result ? 1 : 0)) / quiz.questions.length) * 100))

	async function select_answer(choice_id: string) {
		if (result || selected_choice_id) return
		selected_choice_id = choice_id
		error = ''

		try {
			// The server decides: the answer never reaches the browser before this call.
			result = await submit_answer(quiz.id, choice_id)
		} catch (thrown) {
			selected_choice_id = null
			error = thrown instanceof Error ? thrown.message : 'Could not check that answer.'
			return
		}

		if (result.is_correct) correct += 1
		advance_timer = setTimeout(next, 1400)
	}

	function next() {
		if (index === quiz.questions.length - 1) {
			on_finish(correct * 10, correct)
			return
		}
		index += 1
		selected_choice_id = null
		result = null
	}

	onDestroy(() => {
		if (advance_timer) clearTimeout(advance_timer)
	})
</script>

<main
	class="flex min-h-screen flex-col overflow-x-hidden bg-[#071e3b] bg-cover bg-fixed bg-center bg-no-repeat"
	style={`background-image: linear-gradient(rgba(7, 30, 59, 0.94), rgba(7, 30, 59, 0.96)), url('${patternBackground}')`}
>
	<div class="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
		<button
			onclick={on_exit}
			class="cursor-pointer text-sm font-bold text-blue-100/70 transition hover:text-white"
			>← Dashboard</button
		>
		<div class="flex items-center gap-3">
			<span class="rounded-full bg-[#e52f46] px-3 py-1.5 text-xs font-black text-white"
				>{quiz.level}</span
			><span class="text-sm font-bold text-blue-100/70"
				>Question {index + 1} / {quiz.questions.length}</span
			>
		</div>
	</div>
	<div class="h-1.5 w-full overflow-hidden bg-white/10">
		<div class="h-full bg-[#e52f46] transition-all duration-500" style={`width:${progress}%`}></div>
	</div>

	<section
		class="flex flex-1 flex-col border-y border-white/10 bg-gradient-to-b from-[#1a3555]/90 to-[#102b49]/90 shadow-2xl shadow-black/20"
	>
		<div class="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
			<div>
				<span class="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300"
					>{current.category}</span
				>
			</div>
			{#if current.image}<div
					class="mt-6 mb-7 grid h-32 place-items-center rounded-2xl border border-white/10 bg-[#0c2744]/65 text-6xl"
					role="img"
					aria-label="Question illustration"
				>
					{current.image}
				</div>{/if}
			<h1 class="mt-7 text-lg leading-8 font-black text-blue-50 sm:text-xl">{current.prompt}</h1>
			<div class="mt-7 grid gap-3 sm:grid-cols-2">
				{#each current.choices as choice, choice_index (choice.id)}
					{@const is_correct = result?.correct_choice_id === choice.id}
					{@const is_wrong =
						Boolean(result) && selected_choice_id === choice.id && !result?.is_correct}
					<button
						onclick={() => select_answer(choice.id)}
						disabled={Boolean(result) || Boolean(selected_choice_id)}
						class="flex min-h-16 items-center gap-3 rounded-xl border-2 px-4 text-left text-sm font-bold transition {is_correct
							? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-950/25'
							: is_wrong
								? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-950/25'
								: selected_choice_id === choice.id
									? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
									: 'border-white/15 bg-white/[0.03] text-blue-100/75 hover:border-white/30 hover:bg-white/[0.07]'}"
					>
						<span
							class="grid size-8 shrink-0 place-items-center rounded-lg bg-[#0a2440] text-xs font-black text-blue-100 ring-1 ring-white/10"
							>{String.fromCharCode(65 + choice_index)}</span
						>
						{choice.text}
						{#if is_correct}<span class="ml-auto text-emerald-600"
								><Icon name="check" size={19} /></span
							>{:else if is_wrong}<span class="ml-auto text-red-500"
								><Icon name="x" size={19} /></span
							>{/if}
					</button>
				{/each}
			</div>

			{#if error}
				<p
					class="mt-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm font-bold text-red-200"
				>
					{error}
				</p>
			{/if}

			{#if result}
				<div
					class="mt-6 rounded-xl border p-4 {result.is_correct
						? 'border-emerald-400/40 bg-emerald-400/10'
						: 'border-amber-300/40 bg-amber-300/10'}"
				>
					<p class="text-sm font-black {result.is_correct ? 'text-emerald-300' : 'text-amber-300'}">
						{result.is_correct ? 'Correct!' : 'Not quite. Review the correct answer.'}
					</p>
					{#if result.explanation}
						<p class="mt-1 text-sm leading-6 text-blue-100/70">{result.explanation}</p>
					{/if}
				</div>
			{/if}

			<div class="mt-auto min-h-8 pt-8 text-right text-xs font-bold text-blue-100/45">
				{#if result}Continuing automatically…{/if}
			</div>
		</div>
	</section>
</main>
