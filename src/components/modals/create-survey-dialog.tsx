'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import { useRouter } from 'next/navigation';
import { RouterOutput } from '~/lib/trpc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useState } from 'react';

const formSchema = z.object({
  eventId: z.string().transform(val => Number(val)),
  name: z.string().min(2, 'Survey name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').nullable().optional(),
  link: z.string().url('Must be a valid URL'),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  numberOfWinners: z
    .union([z.string(), z.number()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
});

export function CreateSurveyDialog({ events }: { events: RouterOutput['event']['fromUser'] }) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: undefined,
      name: '',
      description: null,
      link: '',
      startDate: new Date(),
      endDate: new Date(),
      numberOfWinners: 20
    }
  });

  const { mutate: createSurvey } = trpc.survey.create.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      toast.success('Survey created successfully');
      setOpened(false);
      form.reset();
      router.refresh();
    },
    onError: error => {
      console.log(error.message);
      console.error(error);
      toast.error('Failed to create survey', { description: error.message });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createSurvey(values);
  }

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild disabled={!events.length}>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Create Survey
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create Survey</DialogTitle>
          <DialogDescription>Create a new survey with rewards and points.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='eventId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select
                    onValueChange={val => {
                      console.log(val);
                      field.onChange(val);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an event' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={String(event.id)}>
                          {event.name}
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
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
              name='link'
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
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} setDate={date => field.onChange(date)} isModal={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} setDate={date => field.onChange(date)} isModal={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='numberOfWinners'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Winners</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' isLoading={loading}>
                Create Survey
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
