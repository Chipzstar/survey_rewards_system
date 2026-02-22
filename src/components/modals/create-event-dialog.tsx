'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, ButtonVariant } from '~/components/ui/button';
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
import { CirclePlus } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '~/components/ui/command';
import { getPredictions } from '~/lib/google';
import { useDebouncedValue } from '~/hooks/use-debounced-value';
import { useDebouncedCallback } from '~/hooks/use-debounced-callback';
import type { RouterOutput } from '~/lib/trpc';

const formSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  date: z.union([z.date(), z.string()]).optional(),
  num_attendees: z.number().min(0),
  num_speakers: z.number().min(0)
});

type EventForDuplicate = Pick<
  RouterOutput['event']['fromUser'][number],
  'name' | 'description' | 'location' | 'date' | 'num_attendees' | 'num_speakers'
>;

interface CreateEventDialogProps {
  variant?: ButtonVariant;
  /** When provided with open/onOpenChange, opens with form pre-filled. If eventId is also set, submit updates the event (edit mode). */
  defaultEvent?: EventForDuplicate | null;
  /** When set with defaultEvent, dialog is in edit mode (update mutation). */
  eventId?: number | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateEventDialog({ variant = 'outline', defaultEvent, eventId, open: controlledOpen, onOpenChange }: CreateEventDialogProps) {
  const router = useRouter();
  const [predictions, setPredictions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: new Date(),
      num_attendees: 100,
      num_speakers: 20
    }
  });

  useEffect(() => {
    if (open && defaultEvent) {
      form.reset({
        name: defaultEvent.name,
        description: defaultEvent.description ?? '',
        location: defaultEvent.location ?? '',
        date: defaultEvent.date ? new Date(defaultEvent.date) : new Date(),
        num_attendees: defaultEvent.num_attendees ?? 100,
        num_speakers: defaultEvent.num_speakers ?? 20
      });
    }
    // Only run when dialog opens with an event to duplicate
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form is stable
  }, [open, defaultEvent]);

  const { mutate: createEvent } = trpc.event.create.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: () => {
      toast.success('Event created successfully');
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: error => toast.error('Failed to create event', { description: error.message }),
    onSettled: () => setLoading(false)
  });

  const { mutate: updateEvent } = trpc.event.update.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: () => {
      toast.success('Event updated successfully');
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: error => toast.error('Failed to update event', { description: error.message }),
    onSettled: () => setLoading(false)
  });

  const isEditMode = Boolean(eventId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditMode && eventId) {
      updateEvent({ id: eventId, ...values });
    } else {
      createEvent(values);
    }
  }

  const autocomplete = useDebouncedCallback(async (query: string) => {
    setPredictions(await getPredictions(query));
  }, 400);

  const isDuplicateMode = Boolean(defaultEvent && !eventId);
  const isEditModeTitle = Boolean(defaultEvent && eventId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant={variant} radius='xl'>
            <CirclePlus className='mr-2 h-4 w-4' />
            Create Event
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{isEditModeTitle ? 'Edit Event' : isDuplicateMode ? 'Duplicate Event' : 'Create Event'}</DialogTitle>
          <DialogDescription>
            {isEditModeTitle
              ? 'Update the event details below.'
              : isDuplicateMode
                ? 'Edit the details below to create a copy of this event.'
                : 'Create a new event to manage surveys and rewards.'}
          </DialogDescription>
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
                    <Command>
                      <CommandInput
                        placeholder=''
                        onValueChange={val => {
                          field.onChange(val);
                          autocomplete(val);
                        }}
                        value={field.value}
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading='Suggestions'>
                          {predictions.map((p, index) => (
                            <CommandItem
                              key={p.value}
                              onSelect={val => {
                                field.onChange(val);
                                autocomplete.flush();
                              }}
                            >
                              {p.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandSeparator />
                      </CommandList>
                    </Command>
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
                    <DateTimePicker {...field} setDate={date => field.onChange(date)} isModal={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='num_attendees'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Attendees</FormLabel>
                    <FormControl>
                      <Input type='number' min={0} {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='num_speakers'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Speakers</FormLabel>
                    <FormControl>
                      <Input type='number' min={0} {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit' isLoading={loading}>
                {isEditMode ? 'Save changes' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
