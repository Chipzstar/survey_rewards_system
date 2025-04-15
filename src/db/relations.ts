import { relations } from 'drizzle-orm';
import {
  eventTable,
  referralTable,
  surveyResponseTable,
  surveyTable,
  usersTable,
  rewardTable,
  genBotResponseTable
} from './schema';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  createdEvents: many(eventTable),
  createdSurveys: many(surveyTable),
  surveyResponses: many(surveyResponseTable),
  rewards: many(rewardTable)
}));

export const eventRelations = relations(eventTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [eventTable.created_by],
    references: [usersTable.id]
  }),
  surveys: many(surveyTable)
}));

export const surveyRelations = relations(surveyTable, ({ one, many }) => ({
  event: one(eventTable, {
    fields: [surveyTable.event_id],
    references: [eventTable.id]
  }),
  creator: one(usersTable, {
    fields: [surveyTable.created_by],
    references: [usersTable.id]
  }),
  responses: many(surveyResponseTable),
  referrals: many(referralTable),
  rewards: many(rewardTable),
  genBotResponses: many(genBotResponseTable)
}));

export const surveyResponseRelations = relations(surveyResponseTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [surveyResponseTable.survey_id],
    references: [surveyTable.id]
  }),
  reward: one(rewardTable, {
    fields: [surveyResponseTable.reward_id],
    references: [rewardTable.id]
  })
}));

export const genBotResponseRelations = relations(genBotResponseTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [genBotResponseTable.survey_id],
    references: [surveyTable.id]
  })
}));

export const referralRelations = relations(referralTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [referralTable.survey_id],
    references: [surveyTable.id]
  })
  /*referrer: one(usersTable, {
    fields: [referralTable.referrer_id],
    references: [usersTable.id]
  }),
  referee: one(usersTable, {
    fields: [referralTable.referee_id],
    references: [usersTable.id]
  })*/
}));

export const rewardRelations = relations(rewardTable, ({ one, many }) => ({
  survey: one(surveyTable, {
    fields: [rewardTable.survey_id],
    references: [surveyTable.id]
  }),
  creator: one(usersTable, {
    fields: [rewardTable.user_id],
    references: [usersTable.id]
  }),
  responses: many(surveyResponseTable)
}));
