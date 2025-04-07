'use client';

import { Button, ButtonVariant } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { trpc } from '~/trpc/client';
import { FC, useState } from 'react';
import { CirclePlus, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { PdfUploader } from '~/components/ui/pdf-uploader';
import { TabState } from '~/lib/types';
import { ImageUploader } from '~/components/ui/image-uploader';
import { ScrollArea } from '~/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { rewardSchema } from '~/lib/validators';
import { z } from 'zod';
import { useLoading } from '../providers/loading-provider';
import { toast } from 'sonner';

interface Props {
  id?: number;
  open?: boolean;
  onClose?: () => void;
  variant?: ButtonVariant;
}

type FormData = z.infer<typeof rewardSchema>;

export const CreateRewardDialog: FC<Props> = ({ id = 0, open, onClose, variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState<TabState>('upload');
  const form = useForm<FormData>({
    defaultValues: {
      name: undefined,
      surveyId: undefined,
      ctaText: undefined,
      thumbnail: null,
      link: undefined
    },
    resolver: zodResolver(rewardSchema)
  });
  const utils = trpc.useUtils();
  const { setLoading } = useLoading();
  const { data: surveys } = trpc.survey.fromUser.useQuery();
  const { mutate: createReward } = trpc.reward.create.useMutation({
    onMutate() {
      setLoading(true);
    },
    onSuccess() {
      void utils.reward.all.invalidate();
      if (onClose) {
        onClose();
      }
      toast.success('Reward created successfully');
    },
    onError: error => {
      toast.error('Failed to create reward', { description: error.message });
    },
    onSettled: () => {
      setLoading(false);
    }
  });
  const { mutate: updateReward } = trpc.reward.update.useMutation({
    onMutate() {
      setLoading(true);
    },
    onSuccess() {
      void utils.reward.all.invalidate();
      if (onClose) {
        onClose();
      }
      toast.success('Reward updated successfully');
    },
    onError: error => {
      toast.error('Failed to update reward', { description: error.message });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const onSubmit = (data: FormData) => {
    if (id) {
      void updateReward({ id, ...data });
    } else {
      void createReward(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => (onClose ? onClose() : undefined)}>
      {open === undefined && (
        <DialogTrigger>
          <Button variant={variant} radius='xl'>
            <CirclePlus className='mr-2 h-4 w-4' />
            Add Reward
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-3xl'>
        <DialogTitle className='text-2xl font-medium'>Create Reward</DialogTitle>
        <DialogDescription>Give attendees something to look forward to!</DialogDescription>
        <ScrollArea className='max-h-[calc(100vh-20rem)] overflow-y-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 px-3'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Reward Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter Reward Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='ctaText'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Call to Action Text</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter Text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='surveyId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Survey Name</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose Survey' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {surveys?.map(survey => (
                          <SelectItem key={survey.id} value={String(survey.id)}>
                            {survey.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='thumbnail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUploader
                        thumbnail={field.value}
                        setThumbnail={val => form.setValue('thumbnail', val)}
                        className='sm:max-w-xl'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='link'
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
                            <p>The URL where attendees can claim or download their reward (e.g. pdf resources, etc)</p>
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
                          setRewardLink={val => form.setValue(`link`, val)}
                          className='sm:max-w-xl'
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

              <div className='flex justify-center'>
                <Button type='submit' radius='xl' className='font-normal'>
                  Save Reward
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
