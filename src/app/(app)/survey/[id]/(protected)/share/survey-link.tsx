'use client';

import Link from 'next/link';
import QRCode from 'react-qr-code';
import { FC, useEffect, useMemo, useState } from 'react';

interface Props {
  surveyId: number;
  surveyLink: string | null;
  passcode: string;
  userId: string;
}

export const SurveyLink: FC<Props> = props => {
  const [startTime, setStartTime] = useState(new Date().getTime());

  useEffect(() => {
    console.log(startTime);
    const interval = setInterval(() => {
      setStartTime(new Date().getTime());
    }, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const surveyHref = useMemo(() => {
    return `${props.surveyLink}?id=${props.surveyId}&start_time=${startTime}&user_id=${props.userId}&passcode=${props.passcode}`;
  }, [props, startTime]);

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
      <div className='flex flex-col flex-wrap items-center md:hidden'>
        <h2 className='mb-4 text-2xl font-bold'>Link</h2>
        <Link href={surveyHref} className='text-wrap break-words text-white underline' target='_blank'>
          {props.surveyLink}
        </Link>
      </div>
    </>
  );
};
