import { RouterOutput } from '~/lib/trpc';

export type LeaderboardData = RouterOutput['response']['getLeaderboard'][number];
