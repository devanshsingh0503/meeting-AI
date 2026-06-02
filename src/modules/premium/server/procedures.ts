import { eq, count } from "drizzle-orm";

import { db } from "@/db";
import { polarClient } from "@/lib/polar";
import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

      const subscription = customer.activeSubscriptions[0];

      if (!subscription) {
        return null;
      }

      const product = await polarClient.products.get({
        id: subscription.productId,
      });

      return product;
    } catch (error) {
      console.error("[getCurrentSubscription] Polar API error:", error);
      return null;
    }
  }),
  getProducts: protectedProcedure.query(async () => {
    try {
      const products = await polarClient.products.list({
        isArchived: false,
        isRecurring: true,
        sorting: ["price_amount"],
      });

      return products.result.items;
    } catch (error) {
      console.error("[getProducts] Polar API error:", error);
      return [];
    }
  }),
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

      const subscription = customer.activeSubscriptions[0];

      if (subscription) {
        return null;
      }

      const [userMeetings] = await db
        .select({
          count: count(meetings.id),
        })
        .from(meetings)
        .where(eq(meetings.userId, ctx.auth.user.id));

      const [userAgents] = await db
        .select({
          count: count(agents.id),
        })
        .from(agents)
        .where(eq(agents.userId, ctx.auth.user.id));

      return {
        meetingCount: userMeetings.count,
        agentCount: userAgents.count,
      };
    } catch (error) {
      console.error("[getFreeUsage] Polar API error:", error);
      // Return free tier usage on Polar API failure
      const [userMeetings] = await db
        .select({
          count: count(meetings.id),
        })
        .from(meetings)
        .where(eq(meetings.userId, ctx.auth.user.id));

      const [userAgents] = await db
        .select({
          count: count(agents.id),
        })
        .from(agents)
        .where(eq(agents.userId, ctx.auth.user.id));

      return {
        meetingCount: userMeetings.count,
        agentCount: userAgents.count,
      };
    }
  })
});