export type Level = 'N4' | 'N3';
export type QuizCategory = 'Vocabulary' | 'Kanji' | 'Grammar' | 'Image';

export type Question = {
	id: number;
	level: Level;
	category: QuizCategory;
	prompt: string;
	reading?: string;
	image?: string;
	choices: string[];
	answer: number;
	explanation: string;
};

export type LevelProgress = {
	score: number;
	answered: number;
	best: number;
};

export type UserProgress = Record<Level, LevelProgress>;
