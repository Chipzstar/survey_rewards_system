'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

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
      return (
        <button className='btn btn-primary' onClick={() => alert('Action clicked!')}>
          Action
        </button>
      );
    }
  }
];
