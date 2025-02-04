'use client';

import React, { useState } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form';

interface FormValues {
  referralName: string;
}

export const AddReferralForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      referralName: ''
    }
  });

  const handleSubmit = (values: FormValues) => {
    // Handle referral submission logic here
    console.log('Referral Name:', values);
  };

  return (
    <Form {...form}>
      <div className='flex w-full flex-col gap-y-6'>
        <FormField
          control={form.control}
          name='referralName'
          render={({ field }) => (
            <FormItem>
              <Input
                type='text'
                placeholder='Write name(s) here'
                className='text-black'
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='secondary' onClick={form.handleSubmit(handleSubmit)}>
          Complete
        </Button>
      </div>
    </Form>
  );
};
