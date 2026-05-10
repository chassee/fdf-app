CREATE TABLE `parent_approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`parent_name` varchar(255) NOT NULL,
	`parent_email` varchar(320) NOT NULL,
	`approval_token` varchar(255) NOT NULL,
	`status` enum('pending','approved','denied') NOT NULL DEFAULT 'pending',
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parent_approvals_id` PRIMARY KEY(`id`),
	CONSTRAINT `parent_approvals_approval_token_unique` UNIQUE(`approval_token`)
);
--> statement-breakpoint
ALTER TABLE `parent_approvals` ADD CONSTRAINT `parent_approvals_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;