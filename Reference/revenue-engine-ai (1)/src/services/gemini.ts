import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const architectAgent = async (productDesc: string, hypothesis: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this product and market hypothesis to architect a GTM strategy.
    Product: ${productDesc}
    Hypothesis: ${hypothesis}
    
    Provide a detailed ICP persona, pain mapping, transformation narrative, beta offer, and objection handling scripts.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          pain_mapping: { type: Type.STRING },
          transformation: { type: Type.STRING },
          offer: { type: Type.STRING },
          objection_handling: { type: Type.STRING },
        },
        required: ["persona", "pain_mapping", "transformation", "offer", "objection_handling"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const outreachAgent = async (icp: any, contact: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a personalized cold outreach message for this contact based on the ICP.
    ICP: ${JSON.stringify(icp)}
    Contact: ${contact.name} (${contact.role} at ${contact.company})
    Channel: ${contact.channel}
    
    Make it highly relevant, focusing on their role-based pain and our transformation narrative.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          subject: { type: Type.STRING },
        },
        required: ["message"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const replyIntelligenceAgent = async (reply: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Classify this reply and suggest the next best action.
    Reply: "${reply}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { 
            type: Type.STRING,
            enum: ["positive", "curious", "objection", "price_sensitive", "referral", "ghosted"]
          },
          suggested_reply: { type: Type.STRING },
          next_action: { type: Type.STRING },
        },
        required: ["classification", "suggested_reply", "next_action"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const authorityBuilderAgent = async (product: any, topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a LinkedIn thought leadership post for this product.
    Product: ${product.name} - ${product.description}
    Topic: ${topic}
    
    Focus on building authority and providing value, with a soft CTA to the offer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
        },
        required: ["content"],
      },
    },
  });
  return JSON.parse(response.text);
};
