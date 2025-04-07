import { RouterOutput } from '~/lib/trpc';
import { surveyTable } from '~/db/schema';

export type TabState = 'upload' | 'link';

export type LeaderboardData = RouterOutput['response']['getLeaderboard'][number];

export type SurveyData = typeof surveyTable.$inferSelect;
