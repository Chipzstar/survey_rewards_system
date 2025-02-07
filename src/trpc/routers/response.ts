import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { surveyResponseTable } from '~/db/schema';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { sortResponsesByCompletionTime } from '~/lib/utils';
import { differenceInSeconds } from 'date-fns';

export const responseRouter = createTRPCRouter({
  getLeaderboard: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const responses = await ctx.db
      .select()
      .from(surveyResponseTable)
      .where(eq(surveyResponseTable.survey_id, input.id))
      .orderBy(desc(surveyResponseTable.created_at));

    const sortedResponses = sortResponsesByCompletionTime(responses);

    const data = sortedResponses.map((response, index) => {
      const completion_time = differenceInSeconds(new Date(response.completed_at), new Date(response.started_at));
      return {
        rank: index + 1,
        userId: response.user_id,
        time: completion_time,
        ref: response.referrals,
        total: response.points_earned
      };
    });
    console.log(data);
    return data;
  })
});
