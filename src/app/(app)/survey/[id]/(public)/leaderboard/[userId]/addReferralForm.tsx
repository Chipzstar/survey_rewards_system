'use client';

import { toast } from 'sonner';
import React, { FC, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { trpc } from '~/trpc/client';
import { useLoading } from '~/components/providers/loading-provider';

interface Props {
  surveyId: number;
  userId: string;
}

interface FormValues {
  referralNames: string;
}

export const AddReferralForm: FC<Props> = props => {
  const { setLoading } = useLoading();
  const form = useForm<FormValues>({
    defaultValues: {
      referralNames: ''
    }
  });
  const { mutate: addReferral } = trpc.survey.addReferral.useMutation({
    onSuccess: data => {
      toast.success(`${data.name} added successfully`);
      console.log('Referral added successfully');
    },
    onError: (error, input) => {
      if (error?.data?.code === 'BAD_REQUEST') {
        toast.error(`You already added ${input.name} as a referral`);
        form.setError('referralNames', {
          type: 'custom',
          message: 'One or more names are already added'
        });
      } else {
        toast.error('Failed to add referrals', { description: error.message });
      }
      console.error(error);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleSubmit = (values: FormValues) => {
    const names = values.referralNames
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0); // Remove empty names
    if (names.length === 0) {
      form.setError('referralNames', {
        type: 'custom',
        message: 'Please enter at least one name'
      });
      return;
    }
    setLoading(true);
    for (const name of names) {
      void addReferral({
        surveyId: props.surveyId,
        userId: props.userId,
        name: name
      });
    }
  };

  return (
    <Form {...form}>
      <div className='flex w-full flex-col gap-y-6'>
        <FormField
          control={form.control}
          name='referralNames'
          render={({ field }) => (
            <FormItem>
              <Input
                type='text'
                placeholder='Enter names separated by comma (e.g., John, Jane, Bob)'
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
