import { createTRPCRouter, protectedProcedure } from '../init';
import { giftCardTable, surveyResponseTable, surveyTable, usersTable } from '~/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { editSurveyFormSchema } from '~/lib/validators';

export const surveyRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    // Fetch survey data from a database or API
    const surveys = await ctx.db.select().from(surveyTable);
    console.log(surveys);
    return surveys;
  }),
  byId: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID from the database or API
    const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, input.id));
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });
    console.log(survey);
    return survey[0];
  }),
  byIdWithAnalytics: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        event: true,
        responses: {
          with: {
            user: true
          }
        },
        referrals: {
          where: (referrals, { eq }) => eq(referrals.is_completed, true)
        },
        giftCards: true
      }
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    console.log(survey);
    return survey[0];
  }),
  update: protectedProcedure.input(editSurveyFormSchema.extend({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
      if (!user[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, input.id));
      if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      const {
        completionPoints,
        deadline,
        eventName,
        surveyName,
        surveyLink,
        referralPoints,
        potentialWinners,
        surveyDescription,
        giftCardAmount,
        giftCardExpiry,
        giftCardName,
        voucherCode
      } = input;
      await ctx.db
        .update(surveyTable)
        .set({
          name: surveyName,
          points: completionPoints,
          link: surveyLink,
          end_date: deadline,
          referral_bonus_points: referralPoints,
          number_of_winners: potentialWinners,
          description: surveyDescription
        })
        .where(eq(surveyTable.id, input.id));
      return survey[0];
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  })
});
