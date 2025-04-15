'use client';

import React from 'react';
import { Button } from '~/components/ui/button';
import { RouterOutput } from '~/lib/trpc';

interface DownloadResourceProps {
  reward: RouterOutput['survey']['byIdWithAnalytics']['rewards'][number];
}

const DownloadResource: React.FC<DownloadResourceProps> = ({ reward }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = reward.link;
    link.download = reward.name || 'reward-resource'; // Default name if not provided
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      className='rounded-lg bg-[#5BB5C1] px-8 py-3 font-medium text-white transition-colors hover:bg-[#4A9BA6]'
      onClick={handleDownload}
      type='button'
    >
      Download Resource
    </Button>
  );
};

export default DownloadResource;
