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
      className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
      onClick={handleDownload}
      type='button'
    >
      Download Reward
    </Button>
  );
};

export default DownloadResource;
