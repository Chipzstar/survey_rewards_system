'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { MenubarItem } from '~/components/ui/menubar';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '~/trpc/client';
import type { RouterOutput } from '~/lib/trpc';
import { Button } from './ui/button';

type SurveyFromUser = RouterOutput['survey']['fromUser'][number];

interface AssignRewardToSurveyDropdownProps {
  rewardId: number;
  currentSurveyId: number;
  /** Surveys other than the one this reward is currently assigned to */
  otherSurveys: SurveyFromUser[];
}

export function AssignRewardToSurveyDropdown({
  rewardId,
  currentSurveyId,
  otherSurveys
}: AssignRewardToSurveyDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: duplicateToSurvey, isPending } = trpc.reward.duplicateToSurvey.useMutation({
    onSuccess: () => {
      toast.success('Reward duplicated and assigned to the selected survey');
      setOpen(false);
      router.refresh();
    },
    onError: error => {
      toast.error('Failed to assign reward', { description: error.message });
    }
  });

  function handleSelect(survey: SurveyFromUser) {
    duplicateToSurvey({ rewardId, surveyId: survey.id });
  }

  return (
    <>
      <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => setOpen(true)}>
        <Copy className='h-4 w-4' />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-md gap-0 p-0'>
          <DialogHeader className='p-4 pb-0'>
            <DialogTitle>Assign to survey</DialogTitle>
          </DialogHeader>
          <Command className='rounded-lg border-0'>
            <CommandInput placeholder='Search by survey title...' />
            <CommandList>
              <CommandEmpty>No survey found.</CommandEmpty>
              <CommandGroup heading='Surveys'>
                {otherSurveys.map(survey => (
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
        </DialogContent>
      </Dialog>
    </>
  );
}
