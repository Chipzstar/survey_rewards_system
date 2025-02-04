'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { RouterOutput } from '~/lib/trpc';
import { editSurveyFormSchema } from '~/lib/validators';
import { useLoading } from '~/components/providers/loading-provider';

export const EditSurveyForm: FC<{ survey: RouterOutput['survey']['byIdWithAnalytics'] }> = ({ survey }) => {
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const utils = trpc.useUtils();
  const { mutateAsync: updateSurvey } = trpc.survey.update.useMutation({
    onSuccess: () => {
      toast.success('Survey updated successfully');
      void utils.survey.byIdWithAnalytics.invalidate({ id: Number(survey.id) });
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const form = useForm<z.infer<typeof editSurveyFormSchema>>({
    resolver: zodResolver(editSurveyFormSchema),
    defaultValues: {
      surveyName: survey.name,
      surveyDescription: survey.description,
      completionPoints: survey.points,
      referralPoints: survey.referral_bonus_points,
      surveyLink: survey.link,
      potentialWinners: survey.number_of_winners,
      deadline: new Date(survey.end_date),
      // Handle empty giftCards array with default values
      giftCardName: survey.giftCards?.[0]?.name ?? '',
      giftCardBrand: survey.giftCards?.[0]?.brand ?? '',
      voucherCode: survey.giftCards?.[0]?.code ?? '',
      giftCardExpiry: survey.giftCards?.[0]?.expiry_date
        ? new Date(survey.giftCards[0].expiry_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      giftCardAmount: survey.giftCards?.[0]?.value
    },
    reValidateMode: 'onSubmit'
  });

  async function onSubmit(values: z.infer<typeof editSurveyFormSchema>) {
    try {
      setLoading(true);
      await updateSurvey({
        id: survey.id,
        ...values
      });
      toast.success('Survey updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-1 place-content-evenly gap-8 lg:grid-cols-2'
      >
        <section className='flex grow flex-col space-y-6'>
          <h3 className='text-lg font-medium text-white'>Survey Details</h3>
          <div className='flex h-full flex-col justify-between space-y-4'>
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
                      <Input type='number' {...field} onChange={e => field.onChange(e.target.value)} />
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
                      <Input type='number' {...field} onChange={e => field.onChange(e.target.value)} />
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
                    <DateTimePicker {...field} setDate={date => field.onChange(date.toISOString())} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className='flex grow flex-col space-y-6'>
          <h3 className='text-lg font-medium text-white'>Gift Card Details</h3>
          <div className='flex h-full flex-col justify-between space-y-4'>
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
              name='giftCardBrand'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gift Card Brand</FormLabel>
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
                    <DateTimePicker {...field} setDate={date => field.onChange(date.toISOString())} />
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
                    <Input type='number' {...field} onChange={e => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className='lg:col-span-2'>
          <Button size='xl' type='submit' className='w-full'>
            Update Survey
          </Button>
        </section>
      </form>
    </Form>
  );
};
