import { createTRPCRouter, protectedProcedure, publicProcedure } from '../init';
import { giftCardTable, referralTable, surveyResponseTable, surveyTable, usersTable } from '~/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, AnyColumn, eq, sql } from 'drizzle-orm';
import { editSurveyFormSchema } from '~/lib/validators';

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
  byIdWithResults: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        giftCards: true,
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
            eq(referralTable.referee_id, input.name.
            ())
          )
        );
      if (referrals.length)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Referral already exists', cause: input.name });

      // add new referral to the database
      const referral = await ctx.db
        .insert(referralTable)
        .values({
          survey_id: input.surveyId,
          referrer_id: input.userId,
          referee_id: input.name.toLowerCase(),
          name: input.name,
          is_completed: false,
          completed_at: null,
          bonus_points_earned: 0
        })
        .returning();

      if (!referral[0]) {
        throw new TRPCError({
          message: 'There was an error creating the referral',
          code: 'INTERNAL_SERVER_ERROR'
        });
      }
      // increment the user's surveyResponse referrals count
      const surveyResponse = await ctx.db
        .update(surveyResponseTable)
        .set({
          referrals: increment(surveyResponseTable.referrals),
          points_earned: increment(surveyResponseTable.points_earned, 25)
        })
        .where(and(eq(surveyResponseTable.user_id, input.userId), eq(surveyResponseTable.survey_id, input.surveyId)));
      console.log(referral[0]);
      return referral[0];
    })
});
