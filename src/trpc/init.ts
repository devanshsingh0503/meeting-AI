import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { req: opts?.req };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  let headersList: Headers;
  
  if (ctx.req instanceof Request) {
    headersList = ctx.req.headers;
  } else {
    headersList = await headers();
  }
  
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({ ctx: { ...ctx, auth: session } });
});
export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

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

      const isPremium = customer.activeSubscriptions.length > 0;
      const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
      const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

      const shouldThrowMeetingError =
        entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
      const shouldThrowAgentError =
        entity === "agents" && isFreeAgentLimitReached && !isPremium;

      if (shouldThrowMeetingError) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the maximum number of free meetings",
        });
      }

      if (shouldThrowAgentError) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the maximum number of free agents",
        });
      }

      return next({ ctx: { ...ctx, customer } });
    } catch (error) {
      // If Polar API fails, allow access (fail-open)
      // Users can create/access but subscription features may not work
      console.error("[premiumProcedure] Polar API error:", error);
      
      const customer = {
        activeSubscriptions: [],
      };

      return next({ ctx: { ...ctx, customer } });
    }
  });
