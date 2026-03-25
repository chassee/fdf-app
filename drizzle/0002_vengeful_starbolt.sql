ALTER TABLE `missions` ADD `category` enum('money','mindset','build','growth') DEFAULT 'money' NOT NULL;--> statement-breakpoint
ALTER TABLE `missions` ADD `sort_order` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `missions` ADD `icon_emoji` varchar(10) DEFAULT '📋';