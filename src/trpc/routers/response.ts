import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { genBotResponseTable, surveyResponseTable, usersTable } from '~/db/schema';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { genPasscode, genUserId, sortResponsesByCompletionTime } from '~/lib/utils';
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
  }),
  create: protectedProcedure
    .input(z.object({ surveyId: z.number(), attendanceReason: z.string(), question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
      if (!user) throw new Error('User not found');

      const response = await ctx.db
        .insert(genBotResponseTable)
        .values({
          response_id: `response_${genPasscode()}`,
          survey_id: input.surveyId,
          user_id: genUserId(),
          question: input.question,
          attendance_reason: input.attendanceReason
        })
        .returning();

      if (!response[0]) throw new Error('Failed to create response');

      return response[0];
    })
});
