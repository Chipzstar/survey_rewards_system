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

type RewardFromUser = RouterOutput['reward']['fromUser'][number];

interface DuplicateRewardDropdownProps {
  /** Survey to assign the duplicated reward to */
  targetSurveyId: number;
  /** Rewards from other surveys (exclude rewards already on this survey). Pass from server or filter client-side. */
  rewardsFromOtherSurveys: RewardFromUser[];
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'neutral';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function DuplicateRewardDropdown({
  targetSurveyId,
  rewardsFromOtherSurveys,
  variant = 'outline',
  size = 'sm',
  className
}: DuplicateRewardDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate: duplicateToSurvey, isPending } = trpc.reward.duplicateToSurvey.useMutation({
    onSuccess: () => {
      toast.success('Reward duplicated and assigned to this survey');
      setOpen(false);
      router.refresh();
    },
    onError: error => {
      toast.error('Failed to duplicate reward', { description: error.message });
    }
  });

  function handleSelect(reward: RewardFromUser) {
    duplicateToSurvey({ rewardId: reward.id, surveyId: targetSurveyId });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} disabled={rewardsFromOtherSurveys.length === 0} className={className}>
          <Copy className='mr-2 h-4 w-4' />
          Choose existing
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='end'>
        <Command>
          <CommandInput placeholder='Search by reward name...' />
          <CommandList>
            <CommandEmpty>No reward found.</CommandEmpty>
            <CommandGroup heading='Rewards from other surveys'>
              {rewardsFromOtherSurveys.map(reward => (
                <CommandItem
                  key={reward.id}
                  value={reward.name}
                  onSelect={() => handleSelect(reward)}
                  disabled={isPending}
                >
                  {reward.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
