import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './column.helpers';

export const usersTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerk_id: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }),
  firstname: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }).notNull(),
  org_id: varchar({ length: 255 }),
  points: integer().default(0).notNull(),
  ...timestamps
});

export const eventTable = pgTable('event', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  location: varchar({ length: 255 }),
  date: timestamp(),
  created_by: integer()
    .references(() => usersTable.id)
    .notNull(),
  ...timestamps
});

export const surveyTable = pgTable('survey', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer().references(() => eventTable.id),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  location: varchar({ length: 255 }),
  link: varchar({ length: 255 }),
  start_date: timestamp({ mode: 'string' }).notNull(),
  end_date: timestamp({ mode: 'string' }).notNull(),
  points: integer().notNull(),
  referral_bonus_points: integer().notNull(),
  created_by: integer()
    .references(() => usersTable.id)
    .notNull(),
  number_of_winners: integer().default(1).notNull(),
  ...timestamps
});

export const surveyResponseTable = pgTable('survey_response', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  survey_id: integer()
    .references(() => surveyTable.id)
    .notNull(),
  user_id: varchar({ length: 255 }).notNull(),
  response_id: varchar({ length: 255 }).notNull(),
  started_at: timestamp({ mode: 'string' }).notNull(),
  completed_at: timestamp({ mode: 'string' }).defaultNow().notNull(),
  is_completed: boolean().default(false),
  points_earned: integer().default(0).notNull(),
  survey_code: varchar({ length: 255 }).default('10021'),
  passcode: varchar({ length: 255 }),
  referrals: integer().default(0).notNull(),
  ...timestamps
});

export const referralTable = pgTable('referral', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  survey_id: integer()
    .references(() => surveyTable.id)
    .notNull(),
  referrer_id: integer()
    .references(() => usersTable.id)
    .notNull(),
  referee_id: integer()
    .references(() => usersTable.id)
    .notNull(),
  is_completed: boolean().default(false),
  completed_at: timestamp(),
  bonus_points_earned: integer().default(0),
  ...timestamps
});

export const giftCardTable = pgTable('gift_card', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  survey_id: integer()
    .references(() => surveyTable.id)
    .notNull(),
  priority: integer().notNull(),
  brand: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 255 }).notNull().unique(),
  expiry_date: timestamp({ mode: 'string' }).notNull(),
  value: integer().notNull(), // Store value in cents
  is_redeemed: boolean().default(false),
  ...timestamps
});

export const surveyWinnerTable = pgTable('survey_winner', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  survey_id: integer()
    .references(() => surveyTable.id)
    .notNull(),
  user_id: integer()
    .references(() => usersTable.id)
    .notNull(),
  gift_card_id: integer()
    .references(() => giftCardTable.id)
    .notNull(),
  rank: integer().notNull(),
  total_points: integer().notNull(),
  ...timestamps
});
