/**
 * Gemini AI agents for Revenue Engine.
 * Architect, Outreach, Reply Intelligence, and Authority Builder agents.
 */

import { GoogleGenAI, Type } from '@google/genai'

let _ai = null
function getAI() {
  if (!_ai) {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY is required for AI features. Add it to your .env file.')
    _ai = new GoogleGenAI({ apiKey: key })
  }
  return _ai
}

const DEFAULT_MODEL = 'gemini-2.0-flash'

/**
 * Architect Agent: Analyzes product and market hypothesis to generate ICP & GTM strategy.
 * @param {string} productDesc - Product description
 * @param {string} hypothesis - Market hypothesis
 * @returns {Promise<{ persona: string, pain_mapping: string, transformation: string, offer: string, objection_handling: string }>}
 */
export async function architectAgent(productDesc, hypothesis) {
  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Analyze this product and market hypothesis to architect a GTM strategy.
    Product: ${productDesc}
    Hypothesis: ${hypothesis}
    
    Provide a detailed ICP persona, pain mapping, transformation narrative, beta offer, and objection handling scripts.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          pain_mapping: { type: Type.STRING },
          transformation: { type: Type.STRING },
          offer: { type: Type.STRING },
          objection_handling: { type: Type.STRING },
        },
        required: ['persona', 'pain_mapping', 'transformation', 'offer', 'objection_handling'],
      },
    },
  })
  return JSON.parse(response.text)
}

/**
 * Outreach Agent: Generates personalized cold outreach for a contact based on ICP.
 * @param {object} icp - Ideal Customer Profile
 * @param {object} contact - Contact with name, role, company, channel
 * @returns {Promise<{ message: string, subject?: string }>}
 */
export async function outreachAgent(icp, contact) {
  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Generate a personalized cold outreach message for this contact based on the ICP.
    ICP: ${JSON.stringify(icp)}
    Contact: ${contact.name} (${contact.role} at ${contact.company})
    Channel: ${contact.channel}
    
    Make it highly relevant, focusing on their role-based pain and our transformation narrative.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          subject: { type: Type.STRING },
        },
        required: ['message'],
      },
    },
  })
  return JSON.parse(response.text)
}

/**
 * Reply Intelligence Agent: Classifies a reply and suggests next action.
 * @param {string} reply - The reply text to classify
 * @returns {Promise<{ classification: string, suggested_reply: string, next_action: string }>}
 */
export async function replyIntelligenceAgent(reply) {
  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Classify this reply and suggest the next best action.
    Reply: "${reply}"`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            enum: ['positive', 'curious', 'objection', 'price_sensitive', 'referral', 'ghosted'],
          },
          suggested_reply: { type: Type.STRING },
          next_action: { type: Type.STRING },
        },
        required: ['classification', 'suggested_reply', 'next_action'],
      },
    },
  })
  return JSON.parse(response.text)
}

/**
 * Authority Builder Agent: Generates LinkedIn thought leadership content.
 * @param {object} product - Product with name and description
 * @param {string} topic - Topic for the post
 * @returns {Promise<{ content: string }>}
 */
export async function authorityBuilderAgent(product, topic) {
  const response = await getAI().models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Generate a LinkedIn thought leadership post for this product.
    Product: ${product.name} - ${product.description}
    Topic: ${topic}
    
    Focus on building authority and providing value, with a soft CTA to the offer.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
        },
        required: ['content'],
      },
    },
  })
  return JSON.parse(response.text)
}
