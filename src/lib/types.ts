import { RouterOutput } from '~/lib/trpc';
import { surveyTable } from '~/db/schema';

export type LeaderboardData = RouterOutput['response']['getLeaderboard'][number];

export type SurveyData = typeof surveyTable.$inferSelect;
