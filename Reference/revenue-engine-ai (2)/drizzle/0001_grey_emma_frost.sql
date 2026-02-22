CREATE TABLE `authority_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`content_type` enum('linkedin_post','newsletter','case_study','thread','article') NOT NULL,
	`title` varchar(500),
	`content` longtext NOT NULL,
	`cta` varchar(500),
	`status` enum('draft','scheduled','published','archived') DEFAULT 'draft',
	`published_at` timestamp,
	`scheduled_for` timestamp,
	`engagement` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authority_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `behaviour_nudges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`nudge_type` enum('missed_outreach','inconsistent_sending','call_avoidance','low_momentum','high_momentum') NOT NULL,
	`message` longtext NOT NULL,
	`severity` enum('info','warning','urgent') DEFAULT 'info',
	`seen` boolean DEFAULT false,
	`seen_at` timestamp,
	`action_taken` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `behaviour_nudges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `behaviour_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`activity_type` enum('outreach_sent','message_edited','reply_reviewed','call_scheduled','revenue_logged','content_posted','dashboard_viewed') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `behaviour_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaign_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`category` varchar(100),
	`is_public` boolean DEFAULT false,
	`template_data` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaign_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `channel_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`channel` enum('gmail','linkedin','twitter','stripe') NOT NULL,
	`account_name` varchar(255),
	`account_email` varchar(320),
	`access_token` longtext,
	`refresh_token` longtext,
	`is_connected` boolean DEFAULT true,
	`connected_at` timestamp DEFAULT (now()),
	`disconnected_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `channel_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100),
	`email` varchar(320),
	`linkedin_url` varchar(500),
	`twitter_handle` varchar(100),
	`company_name` varchar(255),
	`job_title` varchar(255),
	`industry` varchar(255),
	`company_size` varchar(100),
	`status` enum('new','contacted','interested','objection','call_booked','closed_won','closed_lost','ghosted') DEFAULT 'new',
	`source` varchar(100),
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `founder_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`product_description` longtext,
	`target_market` varchar(255),
	`icp_defined` boolean DEFAULT false,
	`icp_persona` varchar(255),
	`icp_company_size` varchar(100),
	`icp_industry` varchar(255),
	`icp_role` varchar(255),
	`icp_pain_points` json,
	`transformation_narrative` longtext,
	`unique_value` longtext,
	`pricing_strategy` varchar(255),
	`price_point` decimal(10,2),
	`beta_offer` longtext,
	`objection_handling_scripts` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `founder_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messaging_experiments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`version_a` longtext NOT NULL,
	`version_b` longtext NOT NULL,
	`total_sent_a` int DEFAULT 0,
	`total_sent_b` int DEFAULT 0,
	`replies_a` int DEFAULT 0,
	`replies_b` int DEFAULT 0,
	`closes_a` int DEFAULT 0,
	`closes_b` int DEFAULT 0,
	`status` enum('active','completed','paused') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messaging_experiments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outreach_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`contact_id` int,
	`channel` enum('email','linkedin','twitter','manual') NOT NULL,
	`message_type` enum('initial','follow_up','referral_ask','call_booking') DEFAULT 'initial',
	`subject` varchar(500),
	`content` longtext NOT NULL,
	`personalization_data` json,
	`status` enum('draft','sent','scheduled','failed') DEFAULT 'draft',
	`sent_at` timestamp,
	`day_in_sequence` int,
	`campaign_id` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outreach_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`contact_id` int NOT NULL,
	`message_id` int,
	`channel` enum('email','linkedin','twitter') NOT NULL,
	`content` longtext NOT NULL,
	`classification` enum('positive','curious','objection','price_sensitive','referral','ghosted','unclassified') DEFAULT 'unclassified',
	`confidence_score` decimal(3,2),
	`suggested_action` longtext,
	`suggested_reply` longtext,
	`reviewed` boolean DEFAULT false,
	`action_taken` longtext,
	`received_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `replies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenue_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`contact_id` int,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'GBP',
	`deal_status` enum('negotiating','closed_won','closed_lost') DEFAULT 'negotiating',
	`closed_date` timestamp,
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revenue_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenue_sprints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`daily_outreach_goal` int DEFAULT 20,
	`daily_follow_up_goal` int DEFAULT 10,
	`total_outreach_completed` int DEFAULT 0,
	`total_follow_ups_completed` int DEFAULT 0,
	`total_replies_received` int DEFAULT 0,
	`total_calls_booked` int DEFAULT 0,
	`total_revenue_generated` decimal(12,2) DEFAULT '0',
	`status` enum('planning','active','completed') DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revenue_sprints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sprint_daily_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sprint_id` int NOT NULL,
	`user_id` int NOT NULL,
	`day_number` varchar(10) NOT NULL,
	`date` timestamp NOT NULL,
	`outreach_completed` int DEFAULT 0,
	`follow_ups_completed` int DEFAULT 0,
	`content_posted` boolean DEFAULT false,
	`pipeline_review_done` boolean DEFAULT false,
	`replies_received` int DEFAULT 0,
	`calls_booked` int DEFAULT 0,
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sprint_daily_tracking_id` PRIMARY KEY(`id`)
);
