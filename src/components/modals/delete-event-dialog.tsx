'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { Trash2 } from 'lucide-react';
import { trpc } from '~/trpc/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteEventDialog({ eventId, eventName }: { eventId: number; eventName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: deleteEvent } = trpc.event.delete.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      setOpen(false);
      router.refresh();
    },
    onError: error => {
      toast.error('Failed to delete event', { description: error.message });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        asChild
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Trash2 className='h-4 w-4 text-gray-500 hover:text-red-500' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{eventName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteEvent({ id: eventId })}
            className='bg-red-600 hover:bg-red-700'
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
