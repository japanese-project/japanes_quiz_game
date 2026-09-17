PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quiz_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`score` real NOT NULL,
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
PRAGMA foreign_keys=ON;