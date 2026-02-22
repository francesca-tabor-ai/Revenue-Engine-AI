import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Founder profile - stores product info, ICP, and pricing strategy
 */
export const founderProfiles = mysqlTable("founder_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productDescription: longtext("product_description"),
  targetMarket: varchar("target_market", { length: 255 }),
  
  // ICP data
  icpDefined: boolean("icp_defined").default(false),
  icpPersona: varchar("icp_persona", { length: 255 }),
  icpCompanySize: varchar("icp_company_size", { length: 100 }),
  icpIndustry: varchar("icp_industry", { length: 255 }),
  icpRole: varchar("icp_role", { length: 255 }),
  icpPainPoints: json("icp_pain_points").$type<string[]>(),
  
  // Positioning
  transformationNarrative: longtext("transformation_narrative"),
  uniqueValue: longtext("unique_value"),
  
  // Pricing
  pricingStrategy: varchar("pricing_strategy", { length: 255 }),
  pricePoint: decimal("price_point", { precision: 10, scale: 2 }),
  
  // Offer
  betaOffer: longtext("beta_offer"),
  objectionHandlingScripts: json("objection_handling_scripts").$type<Record<string, string>>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FounderProfile = typeof founderProfiles.$inferSelect;
export type InsertFounderProfile = typeof founderProfiles.$inferInsert;

/**
 * Contacts - people to reach out to
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 320 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  
  companyName: varchar("company_name", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  companySize: varchar("company_size", { length: 100 }),
  
  status: mysqlEnum("status", [
    "new",
    "contacted",
    "interested",
    "objection",
    "call_booked",
    "closed_won",
    "closed_lost",
    "ghosted",
  ]).default("new"),
  
  source: varchar("source", { length: 100 }),
  notes: longtext("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Outreach messages - generated and sent messages
 */
export const outreachMessages = mysqlTable("outreach_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  contactId: int("contact_id"),
  
  channel: mysqlEnum("channel", ["email", "linkedin", "twitter", "manual"]).notNull(),
  messageType: mysqlEnum("message_type", [
    "initial",
    "follow_up",
    "referral_ask",
    "call_booking",
  ]).default("initial"),
  
  subject: varchar("subject", { length: 500 }),
  content: longtext("content").notNull(),
  personalizationData: json("personalization_data").$type<Record<string, string>>(),
  
  status: mysqlEnum("status", ["draft", "sent", "scheduled", "failed"]).default("draft"),
  sentAt: timestamp("sent_at"),
  
  dayInSequence: int("day_in_sequence"),
  campaignId: int("campaign_id"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OutreachMessage = typeof outreachMessages.$inferSelect;
export type InsertOutreachMessage = typeof outreachMessages.$inferInsert;

/**
 * Replies - incoming responses from contacts
 */
export const replies = mysqlTable("replies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  contactId: int("contact_id").notNull(),
  messageId: int("message_id"),
  
  channel: mysqlEnum("channel", ["email", "linkedin", "twitter"]).notNull(),
  content: longtext("content").notNull(),
  
  classification: mysqlEnum("classification", [
    "positive",
    "curious",
    "objection",
    "price_sensitive",
    "referral",
    "ghosted",
    "unclassified",
  ]).default("unclassified"),
  
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  suggestedAction: longtext("suggested_action"),
  suggestedReply: longtext("suggested_reply"),
  
  reviewed: boolean("reviewed").default(false),
  actionTaken: longtext("action_taken"),
  
  receivedAt: timestamp("received_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reply = typeof replies.$inferSelect;
export type InsertReply = typeof replies.$inferInsert;

/**
 * Revenue records - closed deals and revenue tracking
 */
export const revenueRecords = mysqlTable("revenue_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  contactId: int("contact_id"),
  
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GBP"),
  
  dealStatus: mysqlEnum("deal_status", [
    "negotiating",
    "closed_won",
    "closed_lost",
  ]).default("negotiating"),
  
  closedDate: timestamp("closed_date"),
  
  notes: longtext("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RevenueRecord = typeof revenueRecords.$inferSelect;
export type InsertRevenueRecord = typeof revenueRecords.$inferInsert;

/**
 * Messaging experiments - A/B testing variations
 */
export const messagingExperiments = mysqlTable("messaging_experiments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  
  versionA: longtext("version_a").notNull(),
  versionB: longtext("version_b").notNull(),
  
  totalSentA: int("total_sent_a").default(0),
  totalSentB: int("total_sent_b").default(0),
  
  repliesA: int("replies_a").default(0),
  repliesB: int("replies_b").default(0),
  
  closesA: int("closes_a").default(0),
  closesB: int("closes_b").default(0),
  
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MessagingExperiment = typeof messagingExperiments.$inferSelect;
export type InsertMessagingExperiment = typeof messagingExperiments.$inferInsert;

/**
 * Revenue sprints - 7-day intensive campaigns
 */
export const revenueSprints = mysqlTable("revenue_sprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  dailyOutreachGoal: int("daily_outreach_goal").default(20),
  dailyFollowUpGoal: int("daily_follow_up_goal").default(10),
  
  totalOutreachCompleted: int("total_outreach_completed").default(0),
  totalFollowUpsCompleted: int("total_follow_ups_completed").default(0),
  totalRepliesReceived: int("total_replies_received").default(0),
  totalCallsBooked: int("total_calls_booked").default(0),
  totalRevenueGenerated: decimal("total_revenue_generated", { precision: 12, scale: 2 }).default("0"),
  
  status: mysqlEnum("status", ["planning", "active", "completed"]).default("planning"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RevenueSprint = typeof revenueSprints.$inferSelect;
export type InsertRevenueSprint = typeof revenueSprints.$inferInsert;

/**
 * Sprint daily tracking - daily progress within a sprint
 */
export const sprintDailyTracking = mysqlTable("sprint_daily_tracking", {
  id: int("id").autoincrement().primaryKey(),
  sprintId: int("sprint_id").notNull(),
  userId: int("user_id").notNull(),
  
  dayNumber: varchar("day_number", { length: 10 }).notNull(),
  date: timestamp("date").notNull(),
  
  outreachCompleted: int("outreach_completed").default(0),
  followUpsCompleted: int("follow_ups_completed").default(0),
  contentPosted: boolean("content_posted").default(false),
  pipelineReviewDone: boolean("pipeline_review_done").default(false),
  
  repliesReceived: int("replies_received").default(0),
  callsBooked: int("calls_booked").default(0),
  
  notes: longtext("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SprintDailyTracking = typeof sprintDailyTracking.$inferSelect;
export type InsertSprintDailyTracking = typeof sprintDailyTracking.$inferInsert;

/**
 * Authority content - thought leadership posts and articles
 */
export const authorityContent = mysqlTable("authority_content", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  contentType: mysqlEnum("content_type", [
    "linkedin_post",
    "newsletter",
    "case_study",
    "thread",
    "article",
  ]).notNull(),
  
  title: varchar("title", { length: 500 }),
  content: longtext("content").notNull(),
  
  cta: varchar("cta", { length: 500 }),
  
  status: mysqlEnum("status", ["draft", "scheduled", "published", "archived"]).default("draft"),
  
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  
  engagement: int("engagement").default(0),
  clicks: int("clicks").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuthorityContent = typeof authorityContent.$inferSelect;
export type InsertAuthorityContent = typeof authorityContent.$inferInsert;

/**
 * Campaign templates - pre-built outreach sequences
 */
export const campaignTemplates = mysqlTable("campaign_templates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: longtext("description"),
  category: varchar("category", { length: 100 }),
  
  isPublic: boolean("is_public").default(false),
  
  templateData: json("template_data").$type<{
    messages: Array<{
      day: number;
      channel: string;
      subject?: string;
      content: string;
    }>;
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CampaignTemplate = typeof campaignTemplates.$inferSelect;
export type InsertCampaignTemplate = typeof campaignTemplates.$inferInsert;

/**
 * Behaviour tracking - founder activity monitoring
 */
export const behaviourTracking = mysqlTable("behaviour_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  activityType: mysqlEnum("activity_type", [
    "outreach_sent",
    "message_edited",
    "reply_reviewed",
    "call_scheduled",
    "revenue_logged",
    "content_posted",
    "dashboard_viewed",
  ]).notNull(),
  
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  
  metadata: json("metadata").$type<Record<string, unknown>>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BehaviourTracking = typeof behaviourTracking.$inferSelect;
export type InsertBehaviourTracking = typeof behaviourTracking.$inferInsert;

/**
 * Behaviour nudges - AI coaching and reminders
 */
export const behaviourNudges = mysqlTable("behaviour_nudges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  nudgeType: mysqlEnum("nudge_type", [
    "missed_outreach",
    "inconsistent_sending",
    "call_avoidance",
    "low_momentum",
    "high_momentum",
  ]).notNull(),
  
  message: longtext("message").notNull(),
  
  severity: mysqlEnum("severity", ["info", "warning", "urgent"]).default("info"),
  
  seen: boolean("seen").default(false),
  seenAt: timestamp("seen_at"),
  
  actionTaken: boolean("action_taken").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BehaviourNudge = typeof behaviourNudges.$inferSelect;
export type InsertBehaviourNudge = typeof behaviourNudges.$inferInsert;

/**
 * Channel connections - OAuth and API integrations
 */
export const channelConnections = mysqlTable("channel_connections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  channel: mysqlEnum("channel", ["gmail", "linkedin", "twitter", "stripe"]).notNull(),
  
  accountName: varchar("account_name", { length: 255 }),
  accountEmail: varchar("account_email", { length: 320 }),
  
  accessToken: longtext("access_token"),
  refreshToken: longtext("refresh_token"),
  
  isConnected: boolean("is_connected").default(true),
  
  connectedAt: timestamp("connected_at").defaultNow(),
  disconnectedAt: timestamp("disconnected_at"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChannelConnection = typeof channelConnections.$inferSelect;
export type InsertChannelConnection = typeof channelConnections.$inferInsert;
