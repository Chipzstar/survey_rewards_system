'use client';

import { ColumnDef } from '@tanstack/react-table';
import { LeaderboardData } from '~/lib/types';

export const columns: ColumnDef<LeaderboardData>[] = [
  {
    accessorKey: 'rank',
    header: 'Rank'
  },
  {
    accessorKey: 'userId',
    header: 'User ID'
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
