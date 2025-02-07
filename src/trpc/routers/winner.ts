import { createTRPCRouter, publicProcedure } from '~/trpc/init';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { surveyResponseTable, surveyTable, surveyWinnerTable } from '~/db/schema';
import { TRPCError } from '@trpc/server';
import { rankResponses } from '~/lib/utils';

export const winnerRouter = createTRPCRouter({
  getSurveyWinner: publicProcedure
    .input(z.object({ surveyId: z.number(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const winner = await ctx.db.query.surveyWinnerTable.findFirst({
        where: and(eq(surveyWinnerTable.survey_id, input.surveyId), eq(surveyWinnerTable.user_id, input.userId)),
        with: {
          survey: true,
          giftCard: true
        }
      });
      if (!winner) throw new TRPCError({ code: 'NOT_FOUND', message: 'Survey winner not found' });
      return winner;
    }),
  checkSurveyWinner: publicProcedure
    .input(z.object({ surveyId: z.number(), passcode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { surveyId } = input;
      const survey = await ctx.db.query.surveyTable.findFirst({
        where: eq(surveyTable.id, surveyId),
        with: {
          giftCards: true
        }
      });
      if (!survey) throw new TRPCError({ code: 'NOT_FOUND', message: 'Survey not found' });
      if (!survey.giftCards[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Gift card not found' });

      // Check all the survey responses and validate if the passcode belongs to a response
      const responses = await ctx.db
        .select()
        .from(surveyResponseTable)
        .where(and(eq(surveyResponseTable.survey_id, surveyId), eq(surveyResponseTable.is_completed, true)));
      const response = responses.find(r => r.passcode === input.passcode);
      if (!response) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid passcode' });

      // check if a survey winner has already been claimed
      const surveyWinner = await ctx.db
        .select()
        .from(surveyWinnerTable)
        .where(eq(surveyWinnerTable.survey_id, surveyId));

      if (surveyWinner[0] && response.user_id === surveyWinner[0].user_id) {
        return surveyWinner[0];
      } else if (surveyWinner.length) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Sorry, a winner has already been claimed' });
      }

      // Sort the responses using a custom function that takes into account the completion time and the points earned
      const sortedResponses = responses.sort(rankResponses(responses));
      const top10 = sortedResponses.slice(0, 10);

      // check if the response is in the top 10
      const isWinner = top10.some(r => r.user_id === response.user_id);
      if (!isWinner) throw new TRPCError({ code: 'FORBIDDEN', message: 'Sorry, you are not a selected winner' });

      // update the survey winner table
      const winner = await ctx.db
        .insert(surveyWinnerTable)
        .values({
          survey_id: surveyId,
          total_points: response.points_earned,
          user_id: response.user_id,
          gift_card_id: survey.giftCards[0].id,
          rank: top10.indexOf(response) + 1
        })
        .returning();

      if (!winner[0]) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Oops, please try again' });
      console.log(winner[0]);
      return winner[0];
    })
});
