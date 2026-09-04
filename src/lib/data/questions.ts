import type { Question } from '$lib/types';

export const questions: Question[] = [
	{
		id: 1,
		level: 'N4',
		category: 'Vocabulary',
		prompt: 'What does 「あたらしい」 mean?',
		choices: ['New', 'Old', 'Wide', 'Small'],
		answer: 0,
		explanation: '「あたらしい（新しい）」 means “new.”'
	},
	{
		id: 2,
		level: 'N4',
		category: 'Kanji',
		prompt: 'How do you read 「毎朝」?',
		choices: ['まいばん', 'まいあさ', 'けさ', 'あした'],
		answer: 1,
		explanation: '「毎朝」 is read as 「まいあさ」 and means “every morning.”'
	},
	{
		id: 3,
		level: 'N4',
		category: 'Grammar',
		prompt: 'Choose the correct particle: わたしは毎日、日本語 ___ 勉強します。',
		choices: ['が', 'を', 'に', 'で'],
		answer: 1,
		explanation: 'Use the particle 「を」 to mark the object being studied.'
	},
	{
		id: 4,
		level: 'N4',
		category: 'Image',
		prompt: 'Which word matches this image?',
		image: '🗻',
		choices: ['かわ', 'うみ', 'やま', 'そら'],
		answer: 2,
		explanation: 'This is a mountain: 「山（やま）」.'
	},
	{
		id: 5,
		level: 'N4',
		category: 'Grammar',
		prompt: 'Complete the sentence: きのう、映画を ___。',
		choices: ['見ます', '見ました', '見ません', '見るです'],
		answer: 1,
		explanation: '「きのう」 refers to the past, so 「見ました」 is correct.'
	},
	{
		id: 6,
		level: 'N4',
		category: 'Vocabulary',
		prompt: 'Which kanji means 「でんしゃ」?',
		image: '🚃',
		choices: ['電車', '自転車', '飛行機', '船'],
		answer: 0,
		explanation: '「でんしゃ」 is written as 「電車」 and means “train.”'
	},
	{
		id: 7,
		level: 'N3',
		category: 'Vocabulary',
		prompt: 'Which meaning is closest to 「うっかり」?',
		choices: ['注意しないで', 'ゆっくりと', 'しっかりと', '突然に'],
		answer: 0,
		explanation: '「うっかり」 describes doing something carelessly or without enough attention.'
	},
	{
		id: 8,
		level: 'N3',
		category: 'Kanji',
		prompt: 'How do you read 「環境」?',
		choices: ['かんきょう', 'かんけい', 'げんきょう', 'けんきょう'],
		answer: 0,
		explanation: '「環境」 is read as 「かんきょう」 and means “environment.”'
	},
	{
		id: 9,
		level: 'N3',
		category: 'Grammar',
		prompt: 'Complete the sentence: 雨が降っている ___、試合は行われました。',
		choices: ['ために', 'うちに', 'にもかかわらず', 'ところで'],
		answer: 2,
		explanation: 'Use 「にもかかわらず」 when the result contrasts with what is expected.'
	},
	{
		id: 10,
		level: 'N3',
		category: 'Image',
		prompt: 'Which word describes this activity?',
		image: '🌸',
		choices: ['紅葉', '花見', '雪見', '祭り'],
		answer: 1,
		explanation: 'Enjoying cherry blossoms is called 「花見（はなみ）」.'
	},
	{
		id: 11,
		level: 'N3',
		category: 'Grammar',
		prompt: 'Complete the sentence: 日本へ来て ___、もう三年になります。',
		choices: ['から', 'まで', 'だけ', 'しか'],
		answer: 0,
		explanation: 'Use 「てから」 to express time elapsed since an action.'
	},
	{
		id: 12,
		level: 'N3',
		category: 'Vocabulary',
		prompt: 'Complete the sentence: 電車が遅れたので、約束の時間に ___。',
		choices: ['間に合いませんでした', '追いつきました', '乗り換えました', '通り過ぎました'],
		answer: 0,
		explanation: '「間に合わない」 means “not to be in time,” which fits this situation.'
	}
];
