'use client';

import { ColumnDef } from '@tanstack/react-table';

interface LeaderboardData {
  rank: number;
  name: string;
  time: number;
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
    header: 'Referrals'
  },
  {
    accessorKey: 'total',
    header: 'Total'
  }
];
