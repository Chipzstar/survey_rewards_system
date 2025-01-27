'use client';

import { ColumnDef } from '@tanstack/react-table';

interface LeaderboardData {
  rank: number;
  name: string;
  time: string;
  ref: string | number;
  total: number;
}

export const columns: ColumnDef<LeaderboardData>[] = [
  {
    accessorKey: 'rank',
    header: 'Rank'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'time',
    header: 'Time(secs)'
  },
  {
    accessorKey: 'ref',
    header: 'Ref'
  },
  {
    accessorKey: 'total',
    header: 'Total'
  }
];
