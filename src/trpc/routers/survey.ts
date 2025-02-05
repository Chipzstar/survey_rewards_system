import { createTRPCRouter, protectedProcedure, publicProcedure } from '../init';
import {
  giftCardTable,
  referralTable,
  surveyResponseTable,
  surveyTable,
  surveyWinnerTable,
  usersTable
} from '~/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, AnyColumn, eq, sql } from 'drizzle-orm';
import { editSurveyFormSchema } from '~/lib/validators';
import { rankResponses } from '~/lib/utils';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column}
  +
  ${value}`;
};

export const surveyRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    // Fetch survey data from a database or API
    const surveys = await ctx.db.select().from(surveyTable);
    console.log(surveys);
    return surveys;
  }),
  byId: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID from the database or API
    const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, input.id));
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Survey found with that ID' });
    console.log(survey);
    return survey[0];
  }),
  byIdWithResponses: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        responses: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Survey found with that ID' });
    console.log(survey);
    return survey[0];
  }),
  byIdWithAnalytics: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        event: true,
        responses: true,
        referrals: {
          where: (referrals, { eq }) => eq(referrals.is_completed, true)
        },
        giftCards: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    console.log(survey);
    return survey[0];
  }),
  update: protectedProcedure.input(editSurveyFormSchema.extend({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
      if (!user[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, input.id));
      if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Survey not found' });
      const {
        completionPoints,
        deadline,
        surveyName,
        surveyLink,
        referralPoints,
        potentialWinners,
        surveyDescription,
        giftCardAmount,
        giftCardExpiry,
        giftCardBrand,
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
      // upsert the gift card details
      if (giftCardName && giftCardExpiry && giftCardAmount) {
        const [giftCard] = await ctx.db
          .insert(giftCardTable)
          .values({
            survey_id: input.id,
            priority: 1,
            name: giftCardName,
            brand: giftCardBrand,
            code: voucherCode,
            expiry_date: new Date(giftCardExpiry).toDateString(),
            value: giftCardAmount,
            is_redeemed: false
          })
          .onConflictDoUpdate({
            target: giftCardTable.code,
            set: {
              name: giftCardName,
              brand: giftCardBrand,
              code: voucherCode,
              expiry_date: new Date(giftCardExpiry).toDateString(),
              value: giftCardAmount,
              is_redeemed: false
            }
          })
          .returning();
        console.log(giftCard);
      }
      return survey[0];
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    }
  }),
  addReferral: publicProcedure
    .input(z.object({ surveyId: z.number(), userId: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, input.surveyId));
      if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Survey not found' });

      // check if the name provided is already a referral
      let referrals = await ctx.db
        .select()
        .from(referralTable)
        .where(
          and(
            eq(referralTable.survey_id, input.surveyId),
            eq(referralTable.referrer_id, input.userId),
            eq(referralTable.referee_id, input.name.toLowerCase())
          )
        );
      if (referrals.length) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Referral already exists' });

      // add new referral to the database
      await ctx.db.insert(referralTable).values({
        survey_id: input.surveyId,
        referrer_id: input.userId,
        referee_id: input.name.toLowerCase(),
        name: input.name,
        is_completed: false,
        completed_at: null,
        bonus_points_earned: 0
      });
      // increment the user's surveyResponse referrals count
      const surveyResponse = await ctx.db
        .update(surveyResponseTable)
        .set({
          referrals: increment(surveyResponseTable.referrals),
          points_earned: increment(surveyResponseTable.points_earned, 25)
        })
        .where(and(eq(surveyResponseTable.user_id, input.userId), eq(surveyResponseTable.survey_id, input.surveyId)))
        .returning();
      console.log(surveyResponse[0]);
      return surveyResponse[0];
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

      // Sort the responses using a custom function that takes into account the completion time and the points earned
      const sortedResponses = responses.sort(rankResponses(responses));
      const top10 = sortedResponses.slice(0, 10);

      // check if the response is in the top 10
      const isWinner = top10.some(r => r.user_id === response.user_id);
      if (!isWinner) throw new TRPCError({ code: 'FORBIDDEN', message: 'Sorry, you are not a selected winner' });

      // check if a survey winner has already been claimed
      const surveyWinner = await ctx.db
        .select()
        .from(surveyWinnerTable)
        .where(eq(surveyWinnerTable.survey_id, surveyId));

      if (surveyWinner.length)
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Sorry, a winner has already been claimed' });

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
      console.log(winner);
      return winner;
    })
});
