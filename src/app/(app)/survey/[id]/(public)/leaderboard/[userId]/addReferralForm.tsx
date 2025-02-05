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
  referralName: string;
}

export const AddReferralForm: FC<Props> = props => {
  const { setLoading } = useLoading();
  const form = useForm<FormValues>({
    defaultValues: {
      referralName: ''
    }
  });
  const { mutate: addReferral } = trpc.survey.addReferral.useMutation({
    onSuccess: () => {
      toast.success('Referral added successfully');
      console.log('Referral added successfully');
    },
    onError: error => {
      if (error?.data?.code === 'BAD_REQUEST') {
        toast.error('Referral already exists');
        form.setError('referralName', {
          type: 'custom',
          message: 'You already added this person'
        });
      } else {
        toast.error('Failed to add referral', { description: error.message });
      }
      console.error(error);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleSubmit = (values: FormValues) => {
    console.log('Referral Name:', values);
    setLoading(true);
    addReferral({
      surveyId: props.surveyId,
      userId: props.userId,
      name: values.referralName
    });
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
