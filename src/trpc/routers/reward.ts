import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { rewardTable } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { deleteThumbnail, insertNewReward, updateReward } from '~/trpc/routers/utils';
import { rewardSchema } from '~/lib/validators';
import { TRPCError } from '@trpc/server';
import { getUser } from '~/db/helpers';

export const rewardRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const rewards = await ctx.db.query.rewardTable.findMany({
      orderBy: desc(rewardTable.created_at),
      with: {
        survey: true,
        responses: true
      }
    });
    console.log(rewards);
    return rewards;
  }),
  fromUser: protectedProcedure.query(async ({ ctx }) => {
    const dbUser = await getUser(ctx.db, ctx.session);
    const rewards = await ctx.db.query.rewardTable.findMany({
      where: eq(rewardTable.user_id, dbUser.id),
      orderBy: desc(rewardTable.created_at),
      with: {
        survey: true,
        responses: true
      }
    });
    console.log(rewards);
    return rewards;
  }),
  create: protectedProcedure.input(rewardSchema).mutation(async ({ ctx, input }) => {
    try {
      const dbUser = await getUser(ctx.db, ctx.session);
      return await insertNewReward(ctx, dbUser.id, input, true);
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create reward'
      });
    }
  }),
  update: protectedProcedure.input(rewardSchema.extend({ id: z.number() })).mutation(async ({ ctx, input }) => {
    try {
      return await updateReward(ctx, input);
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to update reward'
      });
    }
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const [reward] = await ctx.db.select().from(rewardTable).where(eq(rewardTable.id, input.id));
    if (!reward) throw new Error('Reward not found');
    // Handle thumbnail and link deletion if needed
    void Promise.all(
      [reward.thumbnail, reward.link].map(async val => {
        if (!val) return;
        const key = val.split('/').pop();
        void deleteThumbnail(key!);
      })
    );
    await ctx.db.delete(rewardTable).where(eq(rewardTable.id, input.id));
    return true;
  })
});
