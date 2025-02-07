import { createTRPCRouter, publicProcedure } from '~/trpc/init';
import { z } from 'zod';
import { referralTable } from '~/db/schema';
import { and, eq } from 'drizzle-orm';

export const referralRouter = createTRPCRouter({
  getReferrals: publicProcedure
    .input(
      z.object({
        surveyId: z.number().min(1).max(100),
        userId: z.string().min(1).max(100)
      })
    )
    .query(async ({ ctx, input }) => {
      const referrals = await ctx.db
        .select()
        .from(referralTable)
        .where(and(eq(referralTable.survey_id, input.surveyId), eq(referralTable.referrer_id, input.userId)));
      console.log(referrals);
      return referrals;
    })
});
