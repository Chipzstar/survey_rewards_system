import { createTRPCRouter, protectedProcedure } from '~/trpc/init';
import { eventTable, surveyTable, usersTable } from '~/db/schema';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const eventRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(eventTable);
  }),
  byId: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const event = await ctx.db.select().from(eventTable).where(eq(eventTable.id, input.id));
    if (!event[0]) throw new TRPCError({ code: 'NOT_FOUND', message: 'No Event found with that ID' });
    return event[0];
  }),
  fromUser: protectedProcedure.query(async ({ ctx, input }) => {
    // Fetch survey data from a database or API
    const [dbUser] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));
    if (!dbUser) return [];

    if (dbUser.role === 'admin') {
      return await ctx.db.query.eventTable.findMany({
        orderBy: desc(eventTable.created_at),
        where: isNull(eventTable.deleted_at)
      });
    }

    const events = await ctx.db
      .select()
      .from(eventTable)
      .orderBy(desc(eventTable.created_at))
      .where(and(eq(eventTable.created_by, dbUser.id), isNull(eventTable.deleted_at)));
    console.log(events);
    return events;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().min(10),
        location: z.string().min(2),
        date: z.union([z.date(), z.string()]).optional(),
        num_attendees: z.number().min(0),
        num_speakers: z.number().min(0)
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
          created_by: dbUser.id,
          num_attendees: input.num_attendees,
          num_speakers: input.num_speakers
        })
        .returning();

      return event[0];
    }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const [dbUser] = await ctx.db.select().from(usersTable).where(eq(usersTable.clerk_id, ctx.session.userId));

    if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const event = await ctx.db
      .update(eventTable)
      .set({ deleted_at: new Date() })
      .where(eq(eventTable.id, input.id))
      .returning();

    return event[0];
  })
});
