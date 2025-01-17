import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './column.helpers';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  firstname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }).notNull(),
  orgId: varchar({ length: 255 }),
  ...timestamps
});

export const surveyTable = pgTable('events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  location: varchar({ length: 255 }),
  link: varchar({ length: 255 }),
  start_date: timestamp().notNull(),
  end_date: timestamp().notNull(),
  ...timestamps
});
