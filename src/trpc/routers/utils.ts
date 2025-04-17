import { AnyColumn, eq, sql } from 'drizzle-orm';
import { rewardTable } from '~/db/schema';
import { customAlphabet } from 'nanoid';
import { prettyPrint } from '~/lib/utils';
import { UTApi } from 'uploadthing/server';
import { TContext } from '~/trpc/init';
import { rewardSchema } from '~/lib/validators';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getUser } from '~/db/helpers';

type InsertReward = z.infer<typeof rewardSchema>;

type UpdateReward = InsertReward & { id: number };

export const utapi = new UTApi();

export async function updateReward(ctx: TContext, reward: UpdateReward) {
  const [existingReward] = await ctx.db.select().from(rewardTable).where(eq(rewardTable.id, reward.id));
  if (!existingReward) throw new TRPCError({ code: 'NOT_FOUND', message: 'Reward not found' });

  if (reward.thumbnail === null && existingReward?.thumbnail) {
    // Remove the existing thumbnail from storage if it's being cleared
    const key = existingReward.thumbnail.split('/').pop();
    await deleteThumbnail(key!);
  }

  if (reward.link === null && existingReward?.link) {
    // Remove the existing link from storage if it's being cleared
    const key = existingReward.link.split('/').pop();
    await deleteThumbnail(key!);
  }

  await ctx.db
    .update(rewardTable)
    .set({
      name: reward.name,
      cta_text: reward.ctaText,
      link: reward.link,
      thumbnail: reward.thumbnail
    })
    .where(eq(rewardTable.id, reward.id));
}

export async function insertNewReward(
  ctx: TContext,
  userId: number,
  reward: Omit<InsertReward, 'reward_id'>,
  logging: boolean = false
) {
  const reward_id = parseInt(genRewardId(6), 10);
  const [result] = await ctx.db
    .insert(rewardTable)
    .values({
      reward_id,
      user_id: userId,
      survey_id: reward.surveyId,
      name: reward.name,
      cta_text: reward.ctaText,
      link: reward.link,
      limit: reward.limit,
      thumbnail: reward.thumbnail
    })
    .returning();
  if (logging) {
    console.log('INSERTED REWARD', result);
  }
  return result;
}

export async function deleteThumbnail(key: string) {
  // Assuming utapi is accessible here
  try {
    await utapi.deleteFiles([key]);
    console.log('Deleted thumbnail successfully');
  } catch (err) {
    prettyPrint(err, '*');
  }
}

export const genRewardId = customAlphabet('0123456789', 6);
export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column}
  +
  ${value}`;
};
