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
      deadline: new Date(survey.end_date).toISOString(),
      rewards:
        survey.rewards?.map(reward => ({
          id: reward.id,
          name: reward.name,
          cta_text: reward.cta_text,
          thumbnail: reward.thumbnail,
          link: reward.link,
          limit: reward.limit
        })) ?? []
    },
    reValidateMode: 'onSubmit'
  });

  const { fields, append, remove } = useFieldArray({
    name: 'rewards',
    control: form.control
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid h-full grid-cols-1 place-content-evenly gap-8 lg:grid-cols-2'
      >
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
        <section className='flex grow flex-col space-y-6 lg:h-[calc(100vh-16rem)] lg:overflow-hidden'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Reward Details</h3>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='border-white hover:bg-white/20'
              onClick={() => append({ id: undefined, name: '', cta_text: '', link: '', limit: 1000, thumbnail: null })}
            >
              <Plus className='mr-2 h-4 w-4' />
              <span className='text-sm'>Add Reward</span>
            </Button>
          </div>
          <div className='flex flex-col space-y-6 lg:overflow-y-auto lg:pr-4'>
            {fields.map((_field, index) => (
              <div key={_field.id} className='relative rounded-lg border border-white/20 p-4'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-2 top-2 hover:bg-white/20'
                  onClick={() => remove(index)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name={`rewards.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Reward Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rewards.${index}.cta_text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Call to Action Text</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rewards.${index}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required className='flex items-center gap-2'>
                          Reward Link
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className='cursor-help/70 h-4 w-4' />
                              </TooltipTrigger>
                              <TooltipContent className='max-w-xs bg-white text-gray-900'>
                                <p>
                                  The URL where attendees can claim or download their reward (e.g. pdf resources, etc)
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </FormLabel>
                        <Tabs defaultValue={activeTab} className='w-full'>
                          <TabsList className='grid w-full grid-cols-2'>
                            <TabsTrigger value='upload'>Upload</TabsTrigger>
                            <TabsTrigger value='link'>Link</TabsTrigger>
                          </TabsList>
                          <TabsContent value='upload' className='mt-4'>
                            <PdfUploader
                              rewardLink={field.value}
                              setRewardLink={val => form.setValue(`rewards.${index}.link`, val)}
                            />
                          </TabsContent>
                          <TabsContent value='link' className='mt-4'>
                            <FormControl>
                              <Input {...field} className='w-full' placeholder='https://example.com/reward' />
                            </FormControl>
                            <FormMessage />
                          </TabsContent>
                        </Tabs>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rewards.${index}.thumbnail`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Thumbnail</FormLabel>
                        <FormControl>
                          <ImageUploader
                            thumbnail={field.value}
                            setThumbnail={val => form.setValue(`rewards.${index}.thumbnail`, val)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
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
