// src/app/(app)/survey/[id]/edit/edit-survey-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { RouterOutput } from '~/lib/trpc';

const formSchema = z.object({
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

export const EditSurveyForm: FC<{ survey: RouterOutput['survey']['byIdWithAnalytics'] }> = ({ survey }) => {
  const router = useRouter();
  const { mutate: updateSurvey } = trpc.survey.update.useMutation({
    onSuccess: () => {
      toast.success('Survey updated successfully');
      router.refresh();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: '',
      surveyName: survey.name,
      surveyDescription: survey.description,
      completionPoints: survey.points,
      referralPoints: survey.referral_bonus_points,
      surveyLink: survey.link,
      potentialWinners: survey.number_of_winners,
      deadline: new Date(survey.end_date),
      // Handle empty giftCards array with default values
      giftCardName: survey.giftCards?.[0]?.name ?? '',
      voucherCode: survey.giftCards?.[0]?.code ?? '',
      giftCardExpiry: survey.giftCards?.[0]?.expiry_date
        ? new Date(survey.giftCards[0].expiry_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      giftCardAmount: survey.giftCards?.[0]?.value ?? 0
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateSurvey({
      id: survey.id,
      ...values
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-white'>Survey Details</h3>
          <FormField
            control={form.control}
            name='eventName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='surveyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Survey Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='surveyDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='completionPoints'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Points</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={e => field.onChange(+e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='referralPoints'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Points</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} onChange={e => field.onChange(+e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='surveyLink'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Survey Link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='deadline'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Survey Deadline</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-white'>Gift Card Details</h3>
          <FormField
            control={form.control}
            name='giftCardName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gift Card Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='voucherCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='giftCardExpiry'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gift Card Expiry</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='giftCardAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gift Card Amount</FormLabel>
                <FormControl>
                  <Input type='number' {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='w-full'>
          Update Survey
        </Button>
      </form>
    </Form>
  );
};
