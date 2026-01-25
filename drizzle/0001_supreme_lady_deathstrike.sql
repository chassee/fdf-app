CREATE TABLE `fdf_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`xp_total` int NOT NULL DEFAULT 0,
	`gems_total` int NOT NULL DEFAULT 0,
	`rank_name` varchar(50) NOT NULL DEFAULT 'Pup',
	`streak_days` int NOT NULL DEFAULT 0,
	`last_checkin` varchar(10),
	`vault_activation_date` varchar(10),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fdf_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fdf_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`display_name` varchar(255),
	`dob` varchar(10) NOT NULL,
	`country` varchar(100),
	`dawg_class` enum('builder','creator','tech','money'),
	`year_track` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fdf_users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mission_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`mission_id` int NOT NULL,
	`status` enum('started','completed','claimed') NOT NULL DEFAULT 'started',
	`claimed_at` timestamp,
	CONSTRAINT `mission_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`year_track` int NOT NULL,
	`xp_reward` int NOT NULL,
	`gems_reward` int NOT NULL,
	`week_start` varchar(10) NOT NULL,
	`week_end` varchar(10) NOT NULL,
	`is_active` int NOT NULL DEFAULT 1,
	CONSTRAINT `missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` enum('badge','sticker','frame') NOT NULL,
	`cost_gems` int NOT NULL,
	`rarity` enum('common','rare','legendary') NOT NULL DEFAULT 'common',
	`image_url` text NOT NULL,
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsor_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`email` varchar(320) NOT NULL,
	`budget` text,
	`message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sponsor_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`reward_id` int NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `fdf_progress` ADD CONSTRAINT `fdf_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fdf_users` ADD CONSTRAINT `fdf_users_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_completions` ADD CONSTRAINT `mission_completions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mission_completions` ADD CONSTRAINT `mission_completions_mission_id_missions_id_fk` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_reward_id_rewards_id_fk` FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON DELETE no action ON UPDATE no action;