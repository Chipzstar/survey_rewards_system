import React, { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteSurveyDialog: FC<Props> = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this survey? This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSurveyDialog;
