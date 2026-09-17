const THEME_MUSIC = '/sound/Open_Theme.mp3'
const QUIZ_MUSIC = '/sound/when_start_quiz.mp3'
const CORRECT_SOUND = '/sound/correct_answer1.mp3'
const WRONG_SOUND = '/sound/wrong_answer.mp3'

const BACKGROUND_VOLUME = 0.35
const EFFECT_VOLUME = 0.85

let background: HTMLAudioElement | null = null
let effect: HTMLAudioElement | null = null
let desired_background: string | null = null

function get_background() {
	if (typeof Audio === 'undefined') return null
	background ??= new Audio()
	background.loop = true
	background.volume = BACKGROUND_VOLUME
	return background
}

function stop_effect() {
	if (!effect) return
	effect.onended = null
	effect.onerror = null
	effect.pause()
	effect.currentTime = 0
	effect = null
}

function start_background(source: string) {
	desired_background = source
	stop_effect()

	const player = get_background()
	if (!player) return

	if (!player.src.endsWith(source)) {
		player.pause()
		player.src = source
		player.currentTime = 0
	}

	void player.play().catch(() => {
		// Browsers can block autoplay. The shared layout retries after the next user gesture.
	})
}

export function playThemeMusic() {
	start_background(THEME_MUSIC)
}

export function playQuizMusic() {
	start_background(QUIZ_MUSIC)
}

export function resumeDesiredMusic() {
	if (!desired_background || effect) return
	const player = get_background()
	if (!player) return

	if (!player.src.endsWith(desired_background)) {
		player.src = desired_background
		player.currentTime = 0
	}
	void player.play().catch(() => {})
}

export function stopAllAudio() {
	desired_background = null
	stop_effect()
	if (!background) return
	background.pause()
	background.currentTime = 0
}

export function playAnswerSound(isCorrect: boolean) {
	if (typeof Audio === 'undefined') return

	const background_to_resume = desired_background
	background?.pause()
	stop_effect()

	const answer_sound = new Audio(isCorrect ? CORRECT_SOUND : WRONG_SOUND)
	answer_sound.volume = EFFECT_VOLUME
	effect = answer_sound

	const resume_quiz_music = () => {
		if (effect !== answer_sound) return
		effect = null
		if (desired_background === QUIZ_MUSIC && background_to_resume === QUIZ_MUSIC) {
			resumeDesiredMusic()
		}
	}

	answer_sound.onended = resume_quiz_music
	answer_sound.onerror = resume_quiz_music
	void answer_sound.play().catch(resume_quiz_music)
}
