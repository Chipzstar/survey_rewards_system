import { baseProcedure, createTRPCRouter } from '../init';
import { surveyRouter } from './survey';
import { winnerRouter } from './winner';
import { responseRouter } from './response';
import { referralRouter } from './referral';

export const appRouter = createTRPCRouter({
  survey: surveyRouter,
  winner: winnerRouter,
  referral: referralRouter,
  response: responseRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
