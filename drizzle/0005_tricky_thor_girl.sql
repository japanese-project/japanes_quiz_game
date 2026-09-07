ALTER TABLE `questions` ADD `explanation` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `translation` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `image` text;--> statement-breakpoint
ALTER TABLE `questions` ADD `source_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `questions_source_id_unique` ON `questions` (`source_id`);
