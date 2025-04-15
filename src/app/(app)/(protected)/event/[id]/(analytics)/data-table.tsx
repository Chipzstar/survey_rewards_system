'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import DeleteItemDialog from '~/components/modals/delete-item-dialog';
import { useCallback, useState } from 'react';
import { trpc } from '~/trpc/client';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '~/components/ui/menubar';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { SurveyData } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowId, setRowId] = useState<number | null>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const { mutate } = trpc.survey.delete.useMutation();

  const handleDelete = useCallback(() => {
    if (!rowId) return;
    mutate({ id: rowId }); // Example delete function
    setRowId(null); // Close dialog after delete
  }, [rowId]);

  return (
    <div className='rounded-md border'>
      <DeleteItemDialog open={!!rowId} onClose={() => setRowId(null)} onDelete={handleDelete} />
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
                    const _row = cell.row.original as SurveyData;
                    return (
                      <TableCell key={cell.id} className='flex gap-x-2'>
                        <Menubar className='w-fit border-none bg-transparent'>
                          <MenubarMenu>
                            <MenubarTrigger>
                              <Ellipsis size={18} className='text-foreground' strokeWidth={2} />
                            </MenubarTrigger>
                            <MenubarContent>
                              <Link href={`/survey/${_row.id}/edit`} passHref>
                                <MenubarItem>Edit</MenubarItem>
                              </Link>
                              <MenubarItem onClick={() => setRowId(_row.id)}>Delete</MenubarItem>
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
