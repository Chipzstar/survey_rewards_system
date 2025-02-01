import * as z from 'zod';

export const editSurveyFormSchema = z.object({
  eventName: z.string().min(2, 'Event name must be at least 2 characters'),
  surveyName: z.string().min(2, 'Survey name must be at least 2 characters'),
  surveyDescription: z.string().min(10, 'Description must be at least 10 characters').nullable(),
  completionPoints: z.number().min(1, 'Must be at least 1 point'),
  referralPoints: z.number().min(1, 'Must be at least 1 point'),
  surveyLink: z.string().url('Must be a valid URL').nullable(),
  potentialWinners: z.number().min(1, 'Must have at least 1 winner'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),

  // Gift card details
  giftCardName: z.string().min(2, 'Gift card name must be at least 2 characters'),
  voucherCode: z.string().min(1, 'Voucher code is required'),
  giftCardExpiry: z.date().min(new Date(), 'Expiry date must be in the future'),
  giftCardAmount: z.number().min(1, 'Amount must be greater than 0')
});
