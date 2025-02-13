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

const formSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  date: z.union([z.date(), z.string()]).optional()
});

export function CreateEventDialog() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: new Date()
    }
  });

  const { mutate: createEvent } = trpc.event.create.useMutation({
    onSuccess: () => {
      toast.success('Event created successfully');
      form.reset();
      router.refresh();
    },
    onError: error => {
      toast.error('Failed to create event', { description: error.message });
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEvent(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Create a new event to manage surveys and rewards.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DateTimePicker {...field} setDate={date => field.onChange(date)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Create Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
