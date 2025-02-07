'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { trpc } from '~/trpc/client';
import { LeaderboardData } from '~/lib/types';

interface DataTableProps<TData extends LeaderboardData> {
  surveyId: string;
  columns: ColumnDef<LeaderboardData>[];
  data: TData[];
}

export function DataTable<TData extends LeaderboardData = LeaderboardData>({
  surveyId,
  columns,
  data
}: DataTableProps<TData>) {
  const { data: responses } = trpc.response.getLeaderboard.useQuery({ id: Number(surveyId) }, { initialData: data });

  const table = useReactTable({
    data: responses,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} className='text-base'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
