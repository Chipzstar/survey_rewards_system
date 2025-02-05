import { baseProcedure, createTRPCRouter } from '../init';
import { surveyRouter } from './survey';
import { winnerRouter } from './winner';

export const appRouter = createTRPCRouter({
  survey: surveyRouter,
  winner: winnerRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
