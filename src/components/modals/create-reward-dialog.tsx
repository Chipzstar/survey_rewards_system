import { Button, ButtonVariant } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';
import { CirclePlus } from 'lucide-react';

export function CreateRewardDialog({ variant = 'default' }: { variant?: ButtonVariant }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={variant} radius='xl'>
          <CirclePlus className='mr-2 h-4 w-4' />
          Create Reward
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Reward</DialogTitle>
        <DialogDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nec lorem ac justo suscipit tempor.
        </DialogDescription>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
