'use client';

import { toast } from 'sonner';
import React, { FC, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { trpc } from '~/trpc/client';
import { useLoading } from '~/components/providers/loading-provider';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

interface Props {
  surveyId: number;
  userId: string;
}

interface FormValues {
  referralNames: string[];
}

export const AddReferralForm: FC<Props> = props => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const [inputFields, setInputFields] = useState<number[]>([0]); // Start with one input field

  const form = useForm<FormValues>({
    defaultValues: {
      referralNames: ['']
    }
  });

  const { mutate: addReferrals } = trpc.survey.addReferrals.useMutation({
    onSuccess: data => {
      toast.success(`${data.length} names added successfully`);
      router.refresh();
    },
    onError: (error, input) => {
      if (error?.data?.code === 'BAD_REQUEST') {
        toast.error(`You already added some of the names as referrals`);
      } else {
        toast.error('Failed to add referrals', { description: error.message });
      }
      console.error(error);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const addInputField = () => {
    setInputFields(prev => [...prev, prev.length]);
  };

  const removeInputField = (index: number) => {
    if (inputFields.length > 1) {
      setInputFields(prev => prev.filter((_, i) => i !== index));
      const currentNames = form.getValues('referralNames');
      currentNames.splice(index, 1);
      form.setValue('referralNames', currentNames);
    }
  };

  const handleSubmit = (values: FormValues) => {
    const names = values.referralNames.filter(name => name.trim().length > 0);
    if (names.length === 0) {
      toast.error('Please enter at least one name');
      return;
    }
    setLoading(true);
    void addReferrals({
      surveyId: props.surveyId,
      userId: props.userId,
      names
    });
  };

  return (
    <Form {...form}>
      <div className='flex w-full flex-col gap-y-6'>
        <div className='flex flex-col gap-4'>
          {inputFields.map((_, index) => (
            <div key={index} className='flex items-center gap-2'>
              <FormField
                control={form.control}
                name={`referralNames.${index}`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <Input
                      type='text'
                      placeholder='Enter name'
                      className='text-black'
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {inputFields.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-white hover:bg-white/20'
                  onClick={() => removeInputField(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-4'>
          <Button
            type='button'
            variant='outline'
            className='w-full border-white text-white hover:bg-white/20'
            onClick={addInputField}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Another Name
          </Button>
          <Button
            disabled={!form.formState.isDirty}
            size='lg'
            variant='secondary'
            onClick={form.handleSubmit(handleSubmit)}
          >
            Complete
          </Button>
        </div>
      </div>
    </Form>
  );
};
