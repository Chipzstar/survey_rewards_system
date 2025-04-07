import * as z from 'zod';

export const rewardSchema = z.object({
  surveyId: z.union([z.string().transform(val => Number(val)), z.number()]),
  name: z.string().min(3, 'Reward name must be at least 3 characters'),
  ctaText: z.string().min(1, 'Call to action text is required'),
  link: z.string().url('Must be a valid URL'),
  thumbnail: z.string().url('Must be a valid URL').nullable(),
  limit: z
    .union([z.string(), z.number()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .default(1000)
    .refine(val => val > 0, 'Limit must be greater than 0')
});

export const editSurveyFormSchema = z.object({
  surveyName: z.string().min(2, 'Survey name must be at least 2 characters'),
  surveyDescription: z.string().min(10, 'Description must be at least 10 characters').nullable(),
  surveyLink: z.string().url('Must be a valid URL'),
  potentialWinners: z.number().min(1, 'Must have at least 1 winner'),
  deadline: z.union([
    z.date().min(new Date(), 'Deadline must be in the future'),
    z.string().min(1, 'Deadline must be in the future')
  ])
});
