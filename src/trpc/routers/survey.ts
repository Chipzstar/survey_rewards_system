import { createTRPCRouter, protectedProcedure } from '../init';
import { surveyTable } from '~/db/schema';

export const surveyRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    // Fetch survey data from a database or API
    const surveys = await ctx.db.select().from(surveyTable);
    console.log(surveys);
    return surveys;
  })
});
