'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { trpc } from '~/trpc/client';
import { Textarea } from '~/components/ui/textarea';
import { useLoading } from '~/components/providers/loading-provider';

const formSchema = z.object({
  attendanceReason: z.enum(['learn', 'inspire'], {
    required_error: 'Please select what best describes you'
  }),
  question: z.string().min(3, {
    message: 'Question must be at least 3 characters.'
  })
});

export default function SurveyForm({ surveyId }: { surveyId: number }) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const { mutate: submitResponse } = trpc.response.create.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: data => {
      router.push(`/survey/${surveyId}/reward/${data.user_id}`);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResponse({
      surveyId,
      attendanceReason: values.attendanceReason,
      question: values.question
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 lg:space-y-12'>
        <FormField
          control={form.control}
          name='question'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suggest / Ask A Question & Unlock A Personalised Reward</FormLabel>
              <FormControl>
                <Textarea placeholder='Ask away...' {...field} />
              </FormControl>
              <FormDescription>What question would you like to ask the panelist at the event?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='attendanceReason'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel className='text-2xl font-medium'>What best describes you?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col space-y-3'
                >
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='learn' />
                    </FormControl>
                    <FormLabel className='text-xl font-normal'>I'm attending to learn from speakers</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='inspire' />
                    </FormControl>
                    <FormLabel className='text-xl font-normal'>I'm attending to feel inspired by event</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='space-y-6 text-center'>
          <h3 className='text-2xl font-medium'>Unlock your personalised reward here!</h3>
          <Button type='submit' className='w-full p-6 text-xl' variant='tertiary'>
            Unlock!
          </Button>
        </div>
      </form>
    </Form>
  );
}
