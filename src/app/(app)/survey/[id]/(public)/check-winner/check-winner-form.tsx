'use client';

import React, { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '~/components/providers/loading-provider';
import { trpc } from '~/trpc/client';
import { toast } from 'sonner';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export const CheckWinnerForm: FC<{ surveyId: string }> = props => {
  const [passcode, setPasscode] = useState('');
  const router = useRouter();
  const { setLoading } = useLoading();

  const { mutate: checkSurveyWinner } = trpc.winner.checkSurveyWinner.useMutation({
    onSuccess: data => {
      void router.push(`/survey/${props.surveyId}/winner/${data.user_id}`);
    },
    onError: (error, input) => {
      toast.error(error.message);
      void router.push(`/survey/${props.surveyId}/winner/0`);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleSubmit = useCallback(() => {
    setLoading(true);
    checkSurveyWinner({
      surveyId: Number(props.surveyId),
      passcode
    });
  }, [props.surveyId, passcode]);

  return (
    <>
      <Input
        type='text'
        placeholder='Your Passcode'
        className='mb-4 w-fit'
        value={passcode}
        onChange={e => setPasscode(e.target.value)}
      />
      <Button variant='tertiary' onClick={handleSubmit}>
        Did you win 👀...
      </Button>
    </>
  );
};
