'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RewardData = {
  id: number;
  name: string;
  surveyId: number;
  surveyName: string;
  totalClaimed: number;
  status: string;
  date: string;
};

export const columns: ColumnDef<RewardData>[] = [
  {
    accessorKey: 'name',
    header: 'Reward Name'
  },
  {
    accessorKey: 'surveyName',
    header: 'Survey Name'
  },
  {
    accessorKey: 'totalClaimed',
    header: 'Total Claimed'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <Badge variant={row.original.status === 'Active' ? 'active' : 'error'}>{row.original.status}</Badge>;
    }
  },
  {
    accessorKey: 'date',
    header: 'Date'
    /*cell: ({ row }) => {
      return <span>{format(new Date(row.original.date), 'dd MMM yyyy')}</span>;
    }*/
  },
  {
    accessorKey: 'action',
    header: 'Action'
  }
];
