'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import DeleteItemDialog from '~/components/modals/delete-item-dialog';
import { useCallback, useState } from 'react';
import { trpc } from '~/trpc/client';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '~/components/ui/menubar';
import { Ellipsis, Info, CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { SurveyData } from './columns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from '~/components/ui/button';
import { CreateRewardDialog } from '~/components/modals/create-reward-dialog';
import { DuplicateRewardDropdown } from '~/components/duplicate-reward-dropdown';
import type { RouterOutput } from '~/lib/trpc';

type RewardFromUser = RouterOutput['reward']['fromUser'][number];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rewardsFromUser?: RewardFromUser[];
}

export function DataTable<TData, TValue>({ columns, data, rewardsFromUser = [] }: DataTableProps<TData, TValue>) {
  const [rowId, setRowId] = useState<number | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  /** Which survey's tooltip is open from hover (so we can keep it open while dropdown is open) */
  const [tooltipSurveyId, setTooltipSurveyId] = useState<number | null>(null);
  /** Which survey's duplicate dropdown is open; tooltip stays open while this is set */
  const [dropdownSurveyId, setDropdownSurveyId] = useState<number | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const { mutate } = trpc.survey.delete.useMutation();

  const handleDelete = useCallback(() => {
    if (!rowId) return;
    mutate({ id: rowId });
    setRowId(null);
  }, [rowId]);

  const handleAddReward = (surveyId: number) => {
    setSelectedSurveyId(surveyId);
    setShowRewardDialog(true);
  };

  return (
    <div className='rounded-md border'>
      <DeleteItemDialog open={!!rowId} onClose={() => setRowId(null)} onDelete={handleDelete} />
      {showRewardDialog && selectedSurveyId && (
        <CreateRewardDialog
          open={showRewardDialog}
          onClose={() => {
            setShowRewardDialog(false);
            setSelectedSurveyId(null);
          }}
          surveyId={selectedSurveyId}
        />
      )}
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
            table.getRowModel().rows.map(row => {
              const survey = row.original as SurveyData;
              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => {
                    if (cell.column.id === 'action') {
                      return (
                        <TableCell key={cell.id} className='flex items-center gap-x-2'>
                          {!survey.has_reward && (
                            <TooltipProvider>
                              <Tooltip
                                delayDuration={100}
                                open={tooltipSurveyId === survey.id || dropdownSurveyId === survey.id}
                                onOpenChange={open => setTooltipSurveyId(open ? survey.id : null)}
                              >
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-orange-500"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="flex flex-col gap-2 p-4">
                                  <p className="text-sm text-gray-500">This survey has no reward configured.</p>
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddReward(survey.id)}
                                      className="w-full"
                                    >
                                      <CirclePlus className='h-4 w-4 mr-2' />
                                      Add Reward
                                    </Button>
                                    <DuplicateRewardDropdown
                                      targetSurveyId={survey.id}
                                      rewardsFromOtherSurveys={rewardsFromUser.filter(r => r.survey.id !== survey.id)}
                                      variant="default"
                                      size="sm"
                                      className="w-full"
                                      onOpenChange={open => setDropdownSurveyId(open ? survey.id : null)}
                                    />
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Menubar className='w-fit border-none bg-transparent'>
                            <MenubarMenu>
                              <MenubarTrigger>
                                <Ellipsis size={18} className='text-foreground' strokeWidth={2} />
                              </MenubarTrigger>
                              <MenubarContent>
                                <Link href={`/survey/${survey.id}/edit`} passHref>
                                  <MenubarItem>Edit</MenubarItem>
                                </Link>
                                <MenubarItem onClick={() => setRowId(survey.id)}>Delete</MenubarItem>
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
              );
            })
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
