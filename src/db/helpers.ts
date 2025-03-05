// Helper functions

import { TRPCError } from '@trpc/server';
import { surveyTable, usersTable } from './schema';
import { eq } from 'drizzle-orm';
import { TContext } from '~/trpc/init';
import { SignedInAuthObject } from '@clerk/backend/internal';

export async function getUser(db: TContext['db'], session: SignedInAuthObject) {
  const user = await db.select().from(usersTable).where(eq(usersTable.clerk_id, session.userId));
  if (!user[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
  return user[0];
}

export async function getSurvey(ctx: TContext, surveyId: number) {
  const survey = await ctx.db.select().from(surveyTable).where(eq(surveyTable.id, surveyId));
  if (!survey[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'Survey not found' });
  return survey[0];
}
