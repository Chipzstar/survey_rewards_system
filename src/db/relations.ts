import { relations } from 'drizzle-orm';
import {
  eventTable,
  giftCardTable,
  referralTable,
  surveyResponseTable,
  surveyTable,
  surveyWinnerTable,
  usersTable
} from './schema';

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  createdEvents: many(eventTable),
  createdSurveys: many(surveyTable),
  surveyResponses: many(surveyResponseTable),
  surveyWins: many(surveyWinnerTable)
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
  winners: many(surveyWinnerTable),
  giftCards: many(giftCardTable)
}));

export const surveyResponseRelations = relations(surveyResponseTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [surveyResponseTable.survey_id],
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

export const surveyWinnerRelations = relations(surveyWinnerTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [surveyWinnerTable.survey_id],
    references: [surveyTable.id]
  }),
  user: one(usersTable, {
    fields: [surveyWinnerTable.user_id],
    references: [usersTable.id]
  }),
  giftCard: one(giftCardTable, {
    fields: [surveyWinnerTable.gift_card_id],
    references: [giftCardTable.id]
  })
}));

export const giftCardRelations = relations(giftCardTable, ({ one }) => ({
  survey: one(surveyTable, {
    fields: [giftCardTable.survey_id],
    references: [surveyTable.id]
  })
}));
