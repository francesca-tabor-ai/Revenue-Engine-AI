/**
 * Type definitions for Revenue Engine AI features.
 * JSDoc types for AI agent inputs/outputs and GTM entities.
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} hypothesis
 * @property {string} pricing
 * @property {string} created_at
 */

/**
 * @typedef {Object} ICP
 * @property {number} id
 * @property {number} product_id
 * @property {string} persona
 * @property {string} pain_mapping
 * @property {string} transformation
 * @property {string} offer
 * @property {string} objection_handling
 */

/**
 * @typedef {'lead'|'contacted'|'replied'|'booked'|'paying'|'lost'} ContactStatus
 */

/**
 * @typedef {'positive'|'curious'|'objection'|'price_sensitive'|'referral'|'ghosted'} ReplyType
 */

/**
 * @typedef {Object} Contact
 * @property {number} id
 * @property {number} product_id
 * @property {string} name
 * @property {string} company
 * @property {string} role
 * @property {string} channel
 * @property {ContactStatus} status
 * @property {ReplyType} [reply_type]
 * @property {number} revenue_value
 * @property {string} [last_contacted_at]
 */

/**
 * @typedef {Object} Stats
 * @property {number} total_outreach
 * @property {number} total_replies
 * @property {number} total_booked
 * @property {number} total_paying
 * @property {number} total_revenue
 */
