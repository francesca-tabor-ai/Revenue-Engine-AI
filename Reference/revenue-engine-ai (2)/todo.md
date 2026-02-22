# Revenue Engine AI - Project TODO

## Phase 1: Project Setup & Design System
- [x] Design system setup (colors, typography, spacing, shadows)
- [x] Global CSS variables and Tailwind theme configuration
- [x] DashboardLayout component customization for founder dashboard
- [x] Navigation structure and routing setup
- [x] Auth flow integration and user onboarding page

## Phase 2: Database Schema & Core Models
- [x] Extend schema with Founder profile table (product, ICP, pricing)
- [x] Contacts table (name, company, role, channel, status, reply type)
- [x] Outreach messages table (content, channel, status, sent date)
- [x] Replies table (content, classification, suggested action)
- [x] Revenue records table (contact, value, close date)
- [x] Messaging experiments table (version A/B, reply rate, close rate)
- [x] Sprint records table (start date, goals, progress)
- [x] Authority content table (type, content, posted date, engagement)
- [x] Behaviour tracking table (activity type, timestamp, metrics)
- [x] Campaign templates table (name, type, content)
- [x] Database migrations and verification

## Phase 3: ICP & Offer Architect Agent
- [x] Create ICP architect page UI with multi-step form
- [x] Implement AI agent for ICP definition through interactive questioning
- [x] Pain mapping and transformation narrative generation
- [x] Beta offer and pricing test strategy generation
- [x] Objection handling scripts generation
- [x] Store ICP results in database
- [x] Display ICP summary and edit capabilities
- [x] Create tests for ICP generation logic

## Phase 4: Outreach Execution Agent
- [ ] Create outreach generator page UI
- [ ] Implement AI agent to generate 100 LinkedIn messages
- [ ] Implement AI agent to generate 100 cold email drafts
- [ ] Generate follow-up cadence (Day 3, 7, 14)
- [ ] Generate referral ask template
- [ ] Generate call booking DM
- [ ] Personalization layer to pull company info and role-based pain
- [ ] Store generated messages in database
- [ ] Display message library with filtering and editing
- [ ] Create tests for message generation

## Phase 5: Reply Intelligence Engine
- [ ] Create reply management page UI
- [ ] Implement AI classification system (positive, curious, objection, price sensitive, referral, ghosted)
- [ ] Auto-classify incoming replies
- [ ] Suggest next best action based on classification
- [ ] AI-powered reply rewriting suggestions
- [ ] Update messaging model based on reply patterns
- [ ] Store classifications and suggestions in database
- [ ] Display reply inbox with classification badges
- [ ] Create tests for classification logic

## Phase 6: Revenue Dashboard
- [ ] Create revenue dashboard page with metrics overview
- [ ] Implement metric tracking: outreach volume, reply rate, call rate, close rate, revenue, time to close
- [ ] Real-time metric calculation and display
- [ ] AI-generated optimization suggestions (subject line, ICP narrowing, pricing, channel shift, CTA improvement)
- [ ] Visualization charts (funnel, timeline, channel breakdown)
- [ ] Filter and date range selection
- [ ] Export metrics capability
- [ ] Create tests for metric calculations

## Phase 7: Revenue Sprint Mode
- [ ] Create sprint planning page UI
- [ ] Implement 7-day sprint structure with daily goals
- [ ] Daily task generation (outreach count, follow-ups, content post, pipeline review)
- [ ] Sprint progress tracking and visualization
- [ ] Daily checklist and completion tracking
- [ ] Sprint analytics and performance review
- [ ] Store sprint data in database
- [ ] Create tests for sprint logic

## Phase 8: Authority Builder
- [ ] Create authority builder page UI
- [ ] Implement AI content generation for LinkedIn posts
- [ ] Implement AI content generation for newsletter drafts
- [ ] Implement AI content generation for case study formats
- [ ] Implement AI content generation for authority threads
- [ ] Soft CTA generation aligned with offer
- [ ] Content calendar and scheduling
- [ ] Store generated content in database
- [ ] Display content library with publishing status
- [ ] Create tests for content generation

## Phase 9: Campaign Templates Library
- [ ] Create templates library page UI
- [ ] Build pre-built outreach sequences for common B2B scenarios
- [ ] Build messaging frameworks with customization options
- [ ] Template categorization and search
- [ ] Template preview and quick-apply functionality
- [ ] Store custom templates in database
- [ ] Create tests for template management

## Phase 10: Founder Behaviour Monitor
- [ ] Create behaviour monitoring dashboard UI
- [ ] Implement activity tracking (missed outreach targets, inconsistent sending, message edits, call avoidance)
- [ ] AI coaching nudges and gentle reminders
- [ ] Behaviour analytics and insights
- [ ] Streak tracking and momentum metrics
- [ ] Store behaviour data in database
- [ ] Create tests for behaviour tracking

## Phase 11: Multi-Channel Integration
- [ ] Gmail API integration for email outreach
- [ ] LinkedIn connection and message sending (manual assist initially)
- [ ] Twitter/X integration for outreach
- [ ] Calendar API integration for call scheduling
- [ ] Stripe integration for revenue tracking
- [ ] Channel connection management UI
- [ ] Unified inbox for all channel replies
- [ ] Create tests for integrations

## Phase 12: Analytics & A/B Testing
- [ ] Implement A/B testing framework for messaging variations
- [ ] Track engagement metrics per variation
- [ ] Identify high-performing patterns
- [ ] Analytics dashboard with insights
- [ ] Export analytics reports
- [ ] Create tests for analytics logic

## Phase 13: UI Polish & Optimization
- [ ] Refine design consistency across all pages
- [ ] Implement loading states and error handling
- [ ] Add micro-interactions and animations
- [ ] Optimize performance and responsiveness
- [ ] Cross-browser testing
- [ ] Accessibility audit and fixes

## Phase 14: Testing & Deployment
- [ ] Complete vitest coverage for all features
- [ ] Integration testing for AI workflows
- [ ] User acceptance testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Final checkpoint and deployment preparation
