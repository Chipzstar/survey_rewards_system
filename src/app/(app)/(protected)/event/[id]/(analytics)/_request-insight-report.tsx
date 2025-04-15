'use client';

import React, { FC } from 'react';
import { RouterOutput } from '~/lib/trpc';

const RequestInsightReport: FC<{ event: RouterOutput['event']['byId'] }> = ({ event }) => {
  const requestInsightReport = () => {
    (window as any).$chatwoot.toggle('open');
  };

  return (
    <span className='text-3xl font-medium text-primary underline' onClick={requestInsightReport}>
      Request
    </span>
  );
};
export default RequestInsightReport;
