import { createTRPCRouter, protectedProcedure, publicProcedure, TContext } from '../init';
import { referralTable, rewardTable, surveyResponseTable, surveyTable, usersTable } from '~/db/schema';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { editSurveyFormSchema } from '~/lib/validators';
import { deleteThumbnail, genRewardId, handleExistingReward, increment, insertNewReward } from '~/trpc/routers/utils';
import { getSurvey, getUser } from '~/db/helpers';
import { prettyPrint } from '~/lib/utils';

type Survey = typeof surveyTable.$inferSelect;

async function updateSurveyDetails(ctx: TContext, input: z.infer<typeof editSurveyFormSchema>, survey: Survey) {
  await ctx.db
    .update(surveyTable)
    .set({
      name: input.surveyName,
      link: input.surveyLink,
      end_date: input.deadline,
      number_of_winners: input.potentialWinners,
      description: input.surveyDescription
    })
    .where(eq(surveyTable.id, survey.id));
}

export const surveyRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    // Fetch survey data from a database or API
    return await ctx.db.select().from(surveyTable);
  }),
  fromUser: protectedProcedure.query(async ({ ctx, input }) => {
    // Fetch survey data from a database or API
    const [dbUser] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
    if (!dbUser) return [];

    if (dbUser.role === 'admin') {
      return await ctx.db.query.surveyTable.findMany({
        with: {
          rewards: true
        },
        orderBy: desc(surveyTable.created_at)
      });
    }
    const surveys = await ctx.db.query.surveyTable.findMany({
      with: {
        rewards: true
      },
      where: eq(surveyTable.created_by, dbUser.id),
      orderBy: desc(surveyTable.created_at)
    });
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
  byIdWithEvent: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        event: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Survey found with that ID' });
    console.log(survey);
    return survey[0];
  }),
  byIdWithResults: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const [survey] = await ctx.db.query.surveyTable.findMany({
      with: {
        event: true,
        rewards: true,
        responses: true,
        genBotResponses: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Survey found with that ID' });
    if (!survey.event) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No event found for this survey' });
    console.log(survey);
    return survey;
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
        rewards: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    console.log(survey);
    return survey[0];
  }),
  byIdWithRewards: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    // Fetch a specific survey by ID with associated responses from the database or API
    const survey = await ctx.db.query.surveyTable.findMany({
      with: {
        event: true,
        rewards: true
      },
      where: eq(surveyTable.id, input.id)
    });
    if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND' });

    console.log(survey);
    return survey[0];
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Survey name must be at least 2 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters').nullable().optional(),
        link: z.string().url('Must be a valid URL'),
        startDate: z.union([z.date(), z.string()]),
        endDate: z.union([z.date(), z.string()]),
        points: z.number().min(1, 'Points must be at least 1'),
        referralBonusPoints: z.number().min(1, 'Referral bonus points must be at least 1'),
        numberOfWinners: z.number().min(1, 'Must have at least 1 winner'),
        eventId: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
        if (!user[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

        const survey = await ctx.db
          .insert(surveyTable)
          .values({
            name: input.name,
            description: input.description,
            link: input.link,
            start_date: new Date(input.startDate).toISOString(),
            end_date: new Date(input.endDate).toISOString(),
            points: input.points,
            referral_bonus_points: input.referralBonusPoints,
            number_of_winners: input.numberOfWinners,
            event_id: input.eventId,
            created_by: user[0].id
          })
          .returning();

        if (!survey[0]) {
          throw new TRPCError({
            message: 'There was an error creating the survey',
            code: 'INTERNAL_SERVER_ERROR'
          });
        }

        return survey[0];
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create survey'
        });
      }
    }),
  update: protectedProcedure.input(editSurveyFormSchema.extend({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      await getUser(ctx.db, ctx.session);
      const survey = await getSurvey(ctx, input.id);
      // Update survey details
      await updateSurveyDetails(ctx, input, survey);

      // Fetch existing rewards for the survey
      const existingRewards = await ctx.db.select().from(rewardTable).where(eq(rewardTable.survey_id, input.id));

      // Collect IDs from input rewards
      const inputRewardIds = input.rewards.map(reward => reward.id).filter(id => id !== undefined);

      // Delete rewards that are not in the input
      for (const reward of existingRewards) {
        if (!inputRewardIds.includes(reward.id)) {
          prettyPrint(`DELETING REWARD ${reward.id}`, '*', true);
          // Delete reward from the database
          await ctx.db.delete(rewardTable).where(eq(rewardTable.id, reward.id));
          // Handle thumbnail deletion if needed
          if (reward.thumbnail) {
            const key = reward.thumbnail.split('/').pop();
            void deleteThumbnail(key!);
          }
        }
      }

      // Update rewards details
      if (input.rewards.length) {
        for (const reward of input.rewards) {
          if (reward.id) {
            await handleExistingReward(ctx, reward);
          } else {
            await insertNewReward(ctx, input.id, reward);
          }
        }
      }
      return survey;
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    }
  }),
  addReferrals: publicProcedure
    .input(z.object({ surveyId: z.number(), userId: z.string(), names: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const survey = await getSurvey(ctx, input.surveyId);

      // check if any of the name provided is already a referral
      let existingReferrals = await ctx.db
        .select()
        .from(referralTable)
        .where(
          and(
            eq(referralTable.survey_id, input.surveyId),
            eq(referralTable.referrer_id, input.userId),
            inArray(referralTable.referee_id, input.names)
          )
        );
      if (existingReferrals.length)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Referral already exists', cause: input.names });

      // add new referrals to the database
      const referrals = await ctx.db
        .insert(referralTable)
        .values(
          input.names.map(name => ({
            survey_id: input.surveyId,
            referrer_id: input.userId,
            referee_id: name.toLowerCase(),
            name: name,
            is_completed: false,
            completed_at: null,
            bonus_points_earned: 0
          }))
        )
        .returning();

      if (!referrals.length) {
        throw new TRPCError({
          message: 'There was an error creating the referral',
          code: 'INTERNAL_SERVER_ERROR'
        });
      }
      // increment the user's surveyResponse referrals count
      const surveyResponse = await ctx.db
        .update(surveyResponseTable)
        .set({
          referrals: increment(surveyResponseTable.referrals, referrals.length),
          points_earned: increment(surveyResponseTable.points_earned, referrals.length * 25)
        })
        .where(and(eq(surveyResponseTable.user_id, input.userId), eq(surveyResponseTable.survey_id, input.surveyId)));
      // console.log(referrals);
      return referrals;
    })
});
