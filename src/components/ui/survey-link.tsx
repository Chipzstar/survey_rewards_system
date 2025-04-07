'use client';

import Link from 'next/link';
import QRCode from 'react-qr-code';
import { FC, useEffect, useMemo, useState } from 'react';
import { genPasscode, genUserId } from '~/lib/utils';

interface Props {
  surveyId: number;
  surveyLink: string | null;
}

export const SurveyLink: FC<Props> = props => {
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [userId, setUserId] = useState(genUserId());
  const [passcode, setPasscode] = useState(genPasscode());

  useEffect(() => {
    const interval = setInterval(() => {
      setStartTime(new Date().getTime());
      setUserId(genUserId());
      setPasscode(genPasscode());
    }, 300);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const surveyHref = useMemo(() => {
    return `${props.surveyLink}?id=${props.surveyId}&start_time=${startTime}&user_id=${userId}&passcode=${passcode}`;
  }, [props, startTime, userId, passcode]);

  return (
    <>
      <div className='mb-4 md:mb-8'>
        <QRCode
          value={surveyHref}
          size={256}
          className='sm:max-w-2xl'
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className='flex w-full flex-col items-center md:hidden'>
        <h2 className='mb-4 text-2xl font-bold'>Link</h2>
        <Link href={surveyHref} target='_blank'>
          <span className='text-ellipsis whitespace-nowrap text-wrap underline'>{props.surveyLink}</span>
        </Link>
      </div>
    </>
  );
};
