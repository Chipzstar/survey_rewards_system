import * as z from 'zod';

export const editSurveyFormSchema = z.object({
  surveyName: z.string().min(2, 'Survey name must be at least 2 characters'),
  surveyDescription: z.string().min(10, 'Description must be at least 10 characters').nullable(),
  completionPoints: z
    .union([z.string().min(1, 'Must be at least 1 point'), z.number().min(1, 'Must be at least 1 point')])
    .transform(val => {
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    }),
  referralPoints: z
    .union([z.string().min(1, 'Must be at least 1 point'), z.number().min(1, 'Must be at least 1 point')])
    .transform(val => {
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    }),
  surveyLink: z.string().url('Must be a valid URL'),
  potentialWinners: z.number().min(1, 'Must have at least 1 winner'),
  deadline: z.union([
    z.date().min(new Date(), 'Deadline must be in the future'),
    z.string().min(1, 'Deadline must be in the future')
  ]),

  // Gift card details
  giftCardId: z.number().optional(),
  giftCardName: z.string().min(3, 'Gift card name must be at least 3 characters'),
  giftCardBrand: z.string().min(1, 'Gift card brand is required'),
  voucherCode: z.string().min(1, 'Voucher code is required'),
  giftCardExpiry: z.union([
    z.date().min(new Date(), 'Expiry date must be in the future'),
    z.string().min(1, 'Expiry date must be in the future')
  ]),
  giftCardAmount: z
    .union([z.string().min(1, 'Amount must be greater than 0'), z.number().min(1, 'Amount must be greater than 0')])
    .transform(val => {
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    })
});
