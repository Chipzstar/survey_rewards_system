'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import DeleteItemDialog from '~/components/modals/delete-item-dialog';
import React, { useCallback, useMemo, useState } from 'react';
import { trpc } from '~/trpc/client';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '~/components/ui/menubar';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { CreateRewardDialog } from '~/components/modals/create-reward-dialog';
import { RewardData } from '~/app/(app)/(protected)/rewards/columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function RewardTable<_, TValue>({ columns, data }: DataTableProps<RewardData, TValue>) {
  const [selectedRow, setSelectedRow] = useState<{ edit: number; delete: number } | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardData | undefined>(undefined);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const { mutate: deleteReward } = trpc.reward.delete.useMutation();

  const handleDelete = useCallback(() => {
    if (!selectedRow?.delete) return;
    deleteReward({ id: selectedRow.delete }); // Example delete function
    setSelectedRow(null); // Close dialog after delete
  }, [selectedRow]);

  return (
    <div className='rounded-md border'>
      <CreateRewardDialog
        open={!!selectedReward}
        onClose={() => setSelectedReward(undefined)}
        reward={selectedReward}
      />
      <DeleteItemDialog
        open={!!selectedRow?.delete}
        itemText='reward'
        onClose={() => setSelectedRow(null)}
        onDelete={handleDelete}
      />
      <Table>
        <TableHeader className='bg-neutral-100/50 dark:bg-neutral-800/50'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
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
                {row.getVisibleCells().map(cell => {
                  if (cell.column.id === 'action') {
                    const _row = row.original;
                    return (
                      <TableCell key={cell.id} className='flex gap-x-2'>
                        <Menubar className='w-fit border-none bg-transparent'>
                          <MenubarMenu>
                            <MenubarTrigger>
                              <Ellipsis size={18} className='text-foreground' strokeWidth={2} />
                            </MenubarTrigger>
                            <MenubarContent>
                              <Link href={`/survey/${_row.surveyId}/edit`} passHref>
                                <MenubarItem>Edit Survey</MenubarItem>
                              </Link>
                              <MenubarItem onClick={() => setSelectedReward(_row)}>Edit Reward</MenubarItem>
                              <MenubarItem onClick={() => setSelectedRow({ edit: 0, delete: _row.id })}>
                                Delete
                              </MenubarItem>
                            </MenubarContent>
                          </MenubarMenu>
                        </Menubar>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  );
                })}
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
