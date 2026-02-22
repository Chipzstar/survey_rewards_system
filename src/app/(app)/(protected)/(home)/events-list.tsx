'use client';

import Link from 'next/link';
import { CreateEventDialog } from '~/components/modals/create-event-dialog';
import { DeleteEventDialog } from '~/components/modals/delete-event-dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { CalendarIcon, Copy, Pencil } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useState } from 'react';
import type { RouterOutput } from '~/lib/trpc';

type EventItem = RouterOutput['event']['fromUser'][number];

interface EventsListProps {
  events: EventItem[];
}

export function EventsList({ events: filteredEvents }: EventsListProps) {
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [eventToDuplicate, setEventToDuplicate] = useState<EventItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  function openDuplicateDialog(event: EventItem) {
    setEventToDuplicate(event);
    setDuplicateOpen(true);
  }

  function handleDuplicateOpenChange(open: boolean) {
    setDuplicateOpen(open);
    if (!open) setEventToDuplicate(null);
  }

  function openEditDialog(event: EventItem) {
    setEventToEdit(event);
    setEditOpen(true);
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);
    if (!open) setEventToEdit(null);
  }

  return (
    <>
      <section className='flex grow flex-col justify-start space-y-4'>
        <h2 className='text-2xl'>Your Events</h2>
        {filteredEvents.map(event => {
          const eventDate = new Date(event.date!);
          const isActive = isSameDay(eventDate, new Date());
          const isCompleted = eventDate < new Date(new Date().setHours(0, 0, 0, 0));
          const canEdit = !isCompleted;
          return (
            <div
              key={event.id}
              className='relative flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-primary dark:border-gray-700 dark:bg-gray-800'
            >
              <Link href={`/event/${event.id}`}>
                <div className='flex w-full flex-col items-start'>
                  <h3 className='text-lg font-medium'>{event.name}</h3>
                  <div className='mt-1 flex items-center gap-x-1 md:absolute md:right-4 md:top-4 md:mt-0'>
                    <Badge
                      className=''
                      radius='lg'
                      variant={isActive ? 'active' : isCompleted ? 'completed' : 'upcoming'}
                    >
                      {isActive ? 'Active' : isCompleted ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                  <p className='mt-2 text-sm text-gray-500'>{event.description}</p>
                  <div className='mt-2 flex w-full items-center gap-2 text-ellipsis whitespace-nowrap text-sm text-gray-500'>
                    <CalendarIcon className='h-4 w-4 shrink-0' />
                    <span>{event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'No date set'}</span>
                    <span>•</span>
                    <span className='truncate'>{event.location}</span>
                  </div>
                </div>
              </Link>
              <div className='absolute right-4 top-4 flex gap-1 md:bottom-2 md:top-auto'>
                {canEdit && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditDialog(event);
                    }}
                    aria-label='Edit event'
                  >
                    <Pencil className='h-4 w-4 text-gray-500 hover:text-primary' />
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    openDuplicateDialog(event);
                  }}
                  aria-label='Duplicate event'
                >
                  <Copy className='h-4 w-4 text-gray-500 hover:text-primary' />
                </Button>
                <DeleteEventDialog eventId={event.id} eventName={event.name} />
              </div>
            </div>
          );
        })}
      </section>
      <CreateEventDialog
        open={duplicateOpen}
        onOpenChange={handleDuplicateOpenChange}
        defaultEvent={eventToDuplicate}
      />
      <CreateEventDialog
        open={editOpen}
        onOpenChange={handleEditOpenChange}
        defaultEvent={eventToEdit}
        eventId={eventToEdit?.id ?? null}
      />
    </>
  );
}
