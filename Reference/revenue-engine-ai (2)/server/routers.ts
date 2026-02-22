import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import {
  getFounderProfile,
  upsertFounderProfile,
  getContacts,
  createContact,
  getOutreachMessages,
  createOutreachMessage,
  getReplies,
  createReply,
  getRevenueRecords,
  createRevenueRecord,
  getRevenueSprints,
  createRevenueSprint,
  getAuthorityContent,
  createAuthorityContent,
  getBehaviourNudges,
  createBehaviourNudge,
  getChannelConnections,
  trackBehaviour,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============= Founder Profile =============
  founderProfile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await getFounderProfile(ctx.user.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          productName: z.string().optional(),
          productDescription: z.string().optional(),
          targetMarket: z.string().optional(),
          icpPersona: z.string().optional(),
          icpCompanySize: z.string().optional(),
          icpIndustry: z.string().optional(),
          icpRole: z.string().optional(),
          icpPainPoints: z.array(z.string()).optional(),
          transformationNarrative: z.string().optional(),
          uniqueValue: z.string().optional(),
          pricingStrategy: z.string().optional(),
          pricePoint: z.string().optional(),
          betaOffer: z.string().optional(),
          objectionHandlingScripts: z.record(z.string(), z.string()).optional() as any,
          icpDefined: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await upsertFounderProfile(ctx.user.id, input as any);
      }),
  }),

  // ============= ICP Architect Agent =============
  icpArchitect: router({
    generateICP: protectedProcedure
      .input(
        z.object({
          productDescription: z.string(),
          marketHypothesis: z.string(),
          pricingAssumptions: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const systemPrompt = `You are an expert GTM strategist helping founders define their ideal customer profile (ICP) and craft compelling value propositions. 
        
        Based on the product information provided, generate:
        1. A detailed ICP persona with specific characteristics
        2. Key pain points this ICP experiences
        3. A transformation narrative showing how your product solves their problems
        4. A beta offer strategy
        5. Pricing test strategy recommendations
        6. Common objection handling scripts
        
        Return the response as valid JSON with these exact keys: icpPersona, companySize, industry, jobRole, painPoints (array), transformationNarrative, betaOffer, pricingStrategy, objectionHandlingScripts (object with objection as key and response as value).`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `Product: ${input.productDescription}\n\nMarket Hypothesis: ${input.marketHypothesis}\n\nPricing Assumptions: ${input.pricingAssumptions}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "icp_definition",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  icpPersona: { type: "string" },
                  companySize: { type: "string" },
                  industry: { type: "string" },
                  jobRole: { type: "string" },
                  painPoints: {
                    type: "array",
                    items: { type: "string" },
                  },
                  transformationNarrative: { type: "string" },
                  betaOffer: { type: "string" },
                  pricingStrategy: { type: "string" },
                  objectionHandlingScripts: {
                    type: "object",
                    additionalProperties: { type: "string" },
                  },
                },
                required: [
                  "icpPersona",
                  "companySize",
                  "industry",
                  "jobRole",
                  "painPoints",
                  "transformationNarrative",
                  "betaOffer",
                  "pricingStrategy",
                  "objectionHandlingScripts",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (!content || typeof content !== "string")
          throw new Error("Failed to generate ICP");

        const icpData = JSON.parse(content);

        // Save to database
        await upsertFounderProfile(ctx.user.id, {
          productDescription: input.productDescription,
          icpPersona: icpData.icpPersona,
          icpCompanySize: icpData.companySize,
          icpIndustry: icpData.industry,
          icpRole: icpData.jobRole,
          icpPainPoints: icpData.painPoints,
          transformationNarrative: icpData.transformationNarrative,
          betaOffer: icpData.betaOffer,
          pricingStrategy: icpData.pricingStrategy,
          objectionHandlingScripts: (icpData.objectionHandlingScripts || {}) as Record<string, string>,
          icpDefined: true,
        });

        return icpData;
      }),
  }),

  // ============= Contacts =============
  contacts: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(100),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getContacts(ctx.user.id, input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          linkedinUrl: z.string().optional(),
          twitterHandle: z.string().optional(),
          companyName: z.string().optional(),
          jobTitle: z.string().optional(),
          industry: z.string().optional(),
          companySize: z.string().optional(),
          source: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createContact(ctx.user.id, input);
      }),
  }),

  // ============= Outreach Messages =============
  outreach: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(100),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getOutreachMessages(ctx.user.id, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          channel: z.enum(["email", "linkedin", "twitter", "manual"]),
          messageType: z
            .enum(["initial", "follow_up", "referral_ask", "call_booking"])
            .optional(),
          subject: z.string().optional(),
          content: z.string(),
          contactId: z.number().optional(),
          status: z.enum(["draft", "sent", "scheduled", "failed"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createOutreachMessage(ctx.user.id, input);
      }),
  }),

  // ============= Replies =============
  replies: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(100),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getReplies(ctx.user.id, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          contactId: z.number(),
          channel: z.enum(["email", "linkedin", "twitter"]),
          content: z.string(),
          classification: z
            .enum([
              "positive",
              "curious",
              "objection",
              "price_sensitive",
              "referral",
              "ghosted",
              "unclassified",
            ])
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createReply(ctx.user.id, input);
      }),
  }),

  // ============= Revenue =============
  revenue: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getRevenueRecords(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          amount: z.string(),
          currency: z.string().default("GBP"),
          dealStatus: z
            .enum(["negotiating", "closed_won", "closed_lost"])
            .optional(),
          contactId: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createRevenueRecord(ctx.user.id, input);
      }),
  }),

  // ============= Revenue Sprints =============
  sprints: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getRevenueSprints(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          startDate: z.date(),
          endDate: z.date(),
          dailyOutreachGoal: z.number().default(20),
          dailyFollowUpGoal: z.number().default(10),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createRevenueSprint(ctx.user.id, input);
      }),
  }),

  // ============= Authority Content =============
  authority: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(100),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getAuthorityContent(ctx.user.id, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          contentType: z.enum([
            "linkedin_post",
            "newsletter",
            "case_study",
            "thread",
            "article",
          ]),
          title: z.string().optional(),
          content: z.string(),
          cta: z.string().optional(),
          status: z
            .enum(["draft", "scheduled", "published", "archived"])
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createAuthorityContent(ctx.user.id, input);
      }),
  }),

  // ============= Behaviour Monitoring =============
  behaviour: router({
    nudges: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(10),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getBehaviourNudges(ctx.user.id, input.limit);
      }),

    trackActivity: protectedProcedure
      .input(
        z.object({
          activityType: z.enum([
            "outreach_sent",
            "message_edited",
            "reply_reviewed",
            "call_scheduled",
            "revenue_logged",
            "content_posted",
            "dashboard_viewed",
          ]),
          metadata: z.record(z.string(), z.any()).optional() as any,
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await trackBehaviour(ctx.user.id, {
          activityType: input.activityType,
          metadata: (input.metadata || {}) as any,
        });
      }),
  }),

  // ============= Channel Connections =============
  channels: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getChannelConnections(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
