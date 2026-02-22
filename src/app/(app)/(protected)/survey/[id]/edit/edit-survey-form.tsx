'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { RouterOutput } from '~/lib/trpc';
import { editSurveyFormSchema } from '~/lib/validators';
import { useLoading } from '~/components/providers/loading-provider';
import { Info, Plus, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { PdfUploader } from '~/components/ui/pdf-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ImageUploader } from '~/components/ui/image-uploader';
import { TabState } from '~/lib/types';

export const EditSurveyForm: FC<{ survey: RouterOutput['survey']['byIdWithAnalytics'] }> = ({ survey }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabState>('upload');
  const { setLoading } = useLoading();
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
      surveyLink: survey.link,
      potentialWinners: survey.number_of_winners,
      deadline: new Date(survey.end_date).toISOString()
    },
    reValidateMode: 'onSubmit'
  });

  const { deadline } = form.watch();

  async function onSubmit(values: z.infer<typeof editSurveyFormSchema>) {
    try {
      setLoading(true);
      await updateSurvey({
        id: survey.id,
        ...values
      });
      router.refresh();
      router.back();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscription = form.watch(value => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch()]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid h-full grid-cols-1 place-content-evenly gap-8'>
        <section className='flex grow flex-col space-y-6'>
          <h3 className='text-lg font-medium'>Survey Details</h3>
          <div className='flex flex-col justify-between space-y-4 rounded-lg border border-white/20 p-4'>
            <FormField
              control={form.control}
              name='surveyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Survey Name</FormLabel>
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

            <FormField
              control={form.control}
              name='surveyLink'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Survey Link</FormLabel>
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
                  <FormLabel required>Survey Deadline</FormLabel>
                  <FormControl>
                    <DateTimePicker {...field} setDate={date => field.onChange(date.toISOString())} date={deadline} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className='lg:col-span-2'>
          <Button disabled={!form.formState.isDirty} size='xl' type='submit' className='w-full' variant='tertiary'>
            Update Survey
          </Button>
        </section>
      </form>
    </Form>
  );
};
