import { baseProcedure, createTRPCRouter } from '../init';
import { eventRouter } from './event';
import { surveyRouter } from './survey';
import { winnerRouter } from './winner';
import { responseRouter } from './response';
import { referralRouter } from './referral';

export const appRouter = createTRPCRouter({
  event: eventRouter,
  survey: surveyRouter,
  winner: winnerRouter,
  referral: referralRouter,
  response: responseRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
