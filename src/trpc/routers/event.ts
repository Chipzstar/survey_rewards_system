import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { eventTable, surveyTable, usersTable } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const eventRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(eventTable);
  }),
  fromUser: protectedProcedure.query(async ({ ctx, input }) => {
    // Fetch survey data from a database or API
    const [dbUser] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
    if (!dbUser) return [];

    if (dbUser.role === 'admin') {
      return await ctx.db.query.eventTable.findMany({
        orderBy: desc(eventTable.created_at)
      });
    }

    const events = await ctx.db
      .select()
      .from(eventTable)
      .orderBy(desc(eventTable.created_at))
      .where(eq(eventTable.created_by, dbUser.id));
    console.log(events);
    return events;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().min(10),
        location: z.string().min(2),
        date: z.union([z.date(), z.string()]).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [dbUser] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
      if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      const event = await ctx.db
        .insert(eventTable)
        .values({
          name: input.name,
          description: input.description,
          location: input.location,
          date: input.date ? new Date(input.date) : null,
          created_by: dbUser.id
        })
        .returning();

      return event[0];
    })
});
