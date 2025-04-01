'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '~/components/ui/menubar';
import { useState } from 'react';
import { trpc } from '~/trpc/client';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SurveyData = {
  id: number;
  name: string;
  responses: number;
  time: number;
};

export const columns: ColumnDef<SurveyData>[] = [
  {
    accessorKey: 'name',
    header: 'Survey Name'
  },
  {
    accessorKey: 'responses',
    header: 'Responses'
  },
  {
    accessorKey: 'time',
    header: 'Avg. Time Taken',
    cell: ({ row }) => {
      return <span>{row.original.time > 0 ? row.original.time.toFixed(2) : row.original.time} mins</span>;
    }
  },
  {
    accessorKey: 'share',
    header: 'Share QR',
    cell: ({ row }) => {
      return (
        <Link href={`/survey/${row.original.id}/share`} passHref>
          <Button variant='outline' size='sm' radius='xl'>
            <span className='font-normal'>Share Survey</span>
          </Button>
        </Link>
      );
    }
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const [isDialogOpen, setDialogOpen] = useState(false);
      const { mutate } = trpc.survey.delete.useMutation();
      const handleDelete = () => {
        // Code to delete the survey
        mutate({ id: row.original.id }); // Example delete function
        setDialogOpen(false); // Close dialog after delete
      };
      return (
        <Menubar className='w-fit border-none'>
          <MenubarMenu>
            <MenubarTrigger>
              <Ellipsis size={18} color='black' strokeWidth={2} />
            </MenubarTrigger>
            <MenubarContent>
              <Link href={`/survey/${row.original.id}/edit`} passHref>
                <MenubarItem>Edit Survey</MenubarItem>
              </Link>
              <Link href={`/survey/${row.original.id}/edit`} passHref>
                <MenubarItem>Edit Reward</MenubarItem>
              </Link>
              <MenubarItem onClick={() => setDialogOpen(true)}>Delete</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    }
  }
];
