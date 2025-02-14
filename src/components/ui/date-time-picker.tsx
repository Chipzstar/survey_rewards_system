// src/components/ui/date-time-picker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Input } from './input';
import { useEffect } from 'react';

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  className?: string;
  showTime?: boolean;
  isModal?: boolean;
}

export function DateTimePicker({ date, setDate, className, showTime = true, isModal = false }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Handle date selection
  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      // Preserve the time when changing the date
      const newDate = new Date(selected);
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
      setDate(newDate);
    }
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDate && e.target.value) {
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setSelectedDate(newDate);
      setDate(newDate);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover modal={isModal}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn('w-full justify-start bg-white text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedDate ? format(selectedDate, 'PPP p') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {showTime && (
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar mode='single' selected={selectedDate} onSelect={handleDateSelect} initialFocus />
            <div className='border-t p-3'>
              <Input
                type='time'
                onChange={handleTimeChange}
                value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                className='w-full'
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
