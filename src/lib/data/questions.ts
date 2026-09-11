import type { Question } from '$lib/types'

export const questions: Question[] = [
	{
		id: '1',
		category: 'Vocabulary',
		prompt: 'What does 「あたらしい」 mean?',
		choices: [
			{ id: '1-1', text: 'New' },
			{ id: '1-2', text: 'Old' },
			{ id: '1-3', text: 'Wide' },
			{ id: '1-4', text: 'Small' },
		],
	},
	{
		id: '2',
		category: 'Kanji',
		prompt: 'How do you read 「毎朝」?',
		choices: [
			{ id: '2-1', text: 'まいばん' },
			{ id: '2-2', text: 'まいあさ' },
			{ id: '2-3', text: 'けさ' },
			{ id: '2-4', text: 'あした' },
		],
	},
	{
		id: '3',
		category: 'Grammar',
		prompt: 'Choose the correct particle: わたしは毎日、日本語 ___ 勉強します。',
		choices: [
			{ id: '3-1', text: 'が' },
			{ id: '3-2', text: 'を' },
			{ id: '3-3', text: 'に' },
			{ id: '3-4', text: 'で' },
		],
	},
	{
		id: '4',
		category: 'Vocabulary',
		prompt: 'Which word matches this image?',
		image: '🗻',
		choices: [
			{ id: '4-1', text: 'かわ' },
			{ id: '4-2', text: 'うみ' },
			{ id: '4-3', text: 'やま' },
			{ id: '4-4', text: 'そら' },
		],
	},
	{
		id: '5',
		category: 'Grammar',
		prompt: 'Complete the sentence: きのう、映画を ___。',
		choices: [
			{ id: '5-1', text: '見ます' },
			{ id: '5-2', text: '見ました' },
			{ id: '5-3', text: '見ません' },
			{ id: '5-4', text: '見るです' },
		],
	},
	{
		id: '6',
		category: 'Vocabulary',
		prompt: 'Which kanji means 「でんしゃ」?',
		image: '🚃',
		choices: [
			{ id: '6-1', text: '電車' },
			{ id: '6-2', text: '自転車' },
			{ id: '6-3', text: '飛行機' },
			{ id: '6-4', text: '船' },
		],
	},
	{
		id: '7',
		category: 'Vocabulary',
		prompt: 'Which meaning is closest to 「うっかり」?',
		choices: [
			{ id: '7-1', text: '注意しないで' },
			{ id: '7-2', text: 'ゆっくりと' },
			{ id: '7-3', text: 'しっかりと' },
			{ id: '7-4', text: '突然に' },
		],
	},
	{
		id: '8',
		category: 'Kanji',
		prompt: 'How do you read 「環境」?',
		choices: [
			{ id: '8-1', text: 'かんきょう' },
			{ id: '8-2', text: 'かんけい' },
			{ id: '8-3', text: 'げんきょう' },
			{ id: '8-4', text: 'けんきょう' },
		],
	},
	{
		id: '9',
		category: 'Grammar',
		prompt: 'Complete the sentence: 雨が降っている ___、試合は行われました。',
		choices: [
			{ id: '9-1', text: 'ために' },
			{ id: '9-2', text: 'うちに' },
			{ id: '9-3', text: 'にもかかわらず' },
			{ id: '9-4', text: 'ところで' },
		],
	},
	{
		id: '10',
		category: 'Vocabulary',
		prompt: 'Which word describes this activity?',
		image: '🌸',
		choices: [
			{ id: '10-1', text: '紅葉' },
			{ id: '10-2', text: '花見' },
			{ id: '10-3', text: '雪見' },
			{ id: '10-4', text: '祭り' },
		],
	},
	{
		id: '11',
		category: 'Grammar',
		prompt: 'Complete the sentence: 日本へ来て ___、もう三年になります。',
		choices: [
			{ id: '11-1', text: 'から' },
			{ id: '11-2', text: 'まで' },
			{ id: '11-3', text: 'だけ' },
			{ id: '11-4', text: 'しか' },
		],
	},
	{
		id: '12',
		category: 'Vocabulary',
		prompt: 'Complete the sentence: 電車が遅れたので、約束の時間に ___。',
		choices: [
			{ id: '12-1', text: '間に合いませんでした' },
			{ id: '12-2', text: '追いつきました' },
			{ id: '12-3', text: '乗り換えました' },
			{ id: '12-4', text: '通り過ぎました' },
		],
	},
]
