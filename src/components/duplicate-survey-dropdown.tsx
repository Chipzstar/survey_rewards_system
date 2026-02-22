'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import type { RouterOutput } from '~/lib/trpc';

type SurveyFromUser = RouterOutput['survey']['fromUser'][number];

interface DuplicateSurveyDropdownProps {
  currentEventId: number;
  /** Surveys from other events only (exclude current event). Pass from server or filter client-side. */
  surveysFromOtherEvents: SurveyFromUser[];
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'neutral';
}

export function DuplicateSurveyDropdown({
  currentEventId,
  surveysFromOtherEvents,
  variant = 'outline'
}: DuplicateSurveyDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: duplicateToEvent, isPending } = trpc.survey.duplicateToEvent.useMutation({
    onSuccess: () => {
      toast.success('Survey duplicated and assigned to this event');
      setOpen(false);
      router.refresh();
    },
    onError: error => {
      toast.error('Failed to duplicate survey', { description: error.message });
    }
  });

  function handleSelect(survey: SurveyFromUser) {
    duplicateToEvent({ surveyId: survey.id, eventId: currentEventId });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} radius='xl' disabled={surveysFromOtherEvents.length === 0}>
          <Copy className='mr-2 h-4 w-4' />
          Choose existing
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='end'>
        <Command>
          <CommandInput placeholder='Search by survey title...' />
          <CommandList>
            <CommandEmpty>No survey found.</CommandEmpty>
            <CommandGroup heading='Surveys from other events'>
              {surveysFromOtherEvents.map(survey => (
                <CommandItem
                  key={survey.id}
                  value={survey.name}
                  onSelect={() => handleSelect(survey)}
                  disabled={isPending}
                >
                  {survey.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
