import { createTRPCRouter, protectedProcedure } from '../init';
import { giftCardTable, surveyResponseTable, surveyTable, usersTable } from '~/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

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
  update: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const { id } = input;
    try {
      const user = await ctx.db.select().from(usersTable).where(eq(usersTable.id, id));
      if (!user[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, id));
      if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });
      const { points, referral_bonus_points, number_of_winners, end_date, giftCards } = input;
      await ctx.db
        .update(surveyTable)
        .set({
          points,
          referral_bonus_points,
          number_of_winners,
          end_date
        })
        .where(eq(surveyTable.id, id));
      if (giftCards) {
        // await ctx.db.delete().from(giftCardTable).where(eq(giftCardTable.survey_id, id));
        for (const giftCard of giftCards) {
          await ctx.db.insert(giftCardTable).values({
            survey_id: id,
            name: giftCard.name,
            code: giftCard.code,
            expiry_date: giftCard.expiry_date,
            value: giftCard.value
          });
        }
      }
      return survey[0];
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  })
});
