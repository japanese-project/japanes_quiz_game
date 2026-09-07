ALTER TABLE `question` ADD `explanation` text;--> statement-breakpoint
ALTER TABLE `question` ADD `translation` text;--> statement-breakpoint
ALTER TABLE `question` ADD `image` text;--> statement-breakpoint
ALTER TABLE `question` ADD `source_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `question_source_id_unique` ON `question` (`source_id`);