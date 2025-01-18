import { baseProcedure, createTRPCRouter } from '../init';
import { surveyRouter } from './survey';

export const appRouter = createTRPCRouter({
  survey: surveyRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
