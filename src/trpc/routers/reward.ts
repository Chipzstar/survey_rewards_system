import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { rewardTable } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

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
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const reward = await ctx.db.select().from(rewardTable).where(eq(rewardTable.id, input.id));
    if (!reward[0]) throw new Error('Reward not found');
    await ctx.db.delete(rewardTable).where(eq(rewardTable.id, input.id));
    return true;
  })
});
