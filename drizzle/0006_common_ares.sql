ALTER TABLE `category` RENAME TO `categories`;--> statement-breakpoint
ALTER TABLE `choice` RENAME TO `choices`;--> statement-breakpoint
ALTER TABLE `level` RENAME TO `levels`;--> statement-breakpoint
ALTER TABLE `question` RENAME TO `questions`;--> statement-breakpoint
ALTER TABLE `quiz_attempt` RENAME TO `quiz_attempts`;--> statement-breakpoint
ALTER TABLE `quiz` RENAME TO `quizzes`;--> statement-breakpoint
ALTER TABLE `user` RENAME TO `users`;--> statement-breakpoint
DROP INDEX `category_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`text` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_choices`("id", "question_id", "text", "is_correct") SELECT "id", "question_id", "text", "is_correct" FROM `choices`;--> statement-breakpoint
DROP TABLE `choices`;--> statement-breakpoint
ALTER TABLE `__new_choices` RENAME TO `choices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX `level_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `levels_name_unique` ON `levels` (`name`);--> statement-breakpoint
CREATE TABLE `__new_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`prompt` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`explanation` text,
	`translation` text,
	`image` text,
	`source_id` text,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_questions`("id", "quiz_id", "prompt", "order_index", "explanation", "translation", "image", "source_id") SELECT "id", "quiz_id", "prompt", "order_index", "explanation", "translation", "image", "source_id" FROM `questions`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
ALTER TABLE `__new_questions` RENAME TO `questions`;--> statement-breakpoint
CREATE UNIQUE INDEX `questions_source_id_unique` ON `questions` (`source_id`);--> statement-breakpoint
CREATE TABLE `__new_quiz_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`score` integer NOT NULL,
	`correct_count` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quiz_attempts`("id", "user_id", "quiz_id", "score", "correct_count", "total_questions", "completed_at") SELECT "id", "user_id", "quiz_id", "score", "correct_count", "total_questions", "completed_at" FROM `quiz_attempts`;--> statement-breakpoint
DROP TABLE `quiz_attempts`;--> statement-breakpoint
ALTER TABLE `__new_quiz_attempts` RENAME TO `quiz_attempts`;--> statement-breakpoint
CREATE TABLE `__new_quizzes` (
	`id` text PRIMARY KEY NOT NULL,
	`level_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_quizzes`("id", "level_id", "category_id", "title", "description") SELECT "id", "level_id", "category_id", "title", "description" FROM `quizzes`;--> statement-breakpoint
DROP TABLE `quizzes`;--> statement-breakpoint
ALTER TABLE `__new_quizzes` RENAME TO `quizzes`;--> statement-breakpoint
DROP INDEX `user_username_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "user_id", "expires_at", "created_at") SELECT "id", "user_id", "expires_at", "created_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;