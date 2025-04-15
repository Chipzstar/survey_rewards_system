'use client';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { ShareIcon, Download } from 'lucide-react';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { ScrollArea } from '../ui/scroll-area';

interface ShareEventStatsProps {
  eventName?: string;
  attendees: number;
  speakers: number;
  topWords: string[];

  testimonials: Array<{
    text: string;
    rating: number;
  }>;
}

const WORD_CLOUD_COLORS = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' }
] as const;

export function ShareEventStats({ eventName, attendees, speakers, topWords, testimonials }: ShareEventStatsProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (contentRef.current) {
      try {
        const dataUrl = await toPng(contentRef.current, {
          quality: 1.0,
          backgroundColor: 'white',
          style: {
            background: 'linear-gradient(to bottom, #BFE4E980, white, #ECE0F880)'
          }
        });
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${eventName || 'event'}-stats.png`;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2 text-primary'>
          <ShareIcon className='h-5 w-5' />
          Share Event Stats
        </Button>
      </DialogTrigger>
      <DialogContent
        className='max-w-3xl bg-gradient-to-b from-primary-200/50 via-white to-secondary-200/50'
        withClose={false}
      >
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle>Event Stats</DialogTitle>
            <Button variant='outline' className='flex items-center gap-2' onClick={handleDownload}>
              <Download className='h-4 w-4' />
              Save as Image
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className='h-[80vh]'>
          <div ref={contentRef} className='space-y-8 p-6' data-capture-background>
            <section className='relative'>
              <div className='space-y-4 text-center'>
                <div
                  className="scale-120 mx-12 pointer-events-none absolute inset-0 bg-[url('/share-decorations.png')] bg-contain bg-no-repeat opacity-50"
                  style={{ backgroundSize: '100% 100%' }}
                />
                <h2 className='tracking-loose text-4xl font-medium'>It's a Wrap 🎉</h2>
                <p className='text-balance text-xl font-light text-[#6F7176]'>
                  Thanks for coming to the event, we hope you enjoyed it as much as we did!
                </p>
              </div>

              <div className='pt-8 flex justify-center space-x-4'>
                {/* Sample avatars - replace src with actual avatar images */}
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className='h-16 w-16 rounded-full bg-gray-200' />
                ))}
              </div>
            
            <div className='pt-8 grid grid-cols-2 gap-8'>
              <div className='rounded-lg bg-purple-50 p-6'>
                <p className='text-gray-600'>Attendees</p>
                <p className='text-4xl font-semibold'>{attendees}</p>
              </div>
              <div className='rounded-lg bg-blue-50 p-6'>
                <p className='text-gray-600'>Speakers</p>
                <p className='text-4xl font-semibold'>{speakers}</p>
              </div>
            </div>
          </section>

            <div>
              <h3 className='mb-4 text-lg font-medium'>Top Words Used to Describe Event</h3>
              <div className='flex flex-wrap gap-2'>
                {topWords.map((word, index) => {
                  const style = WORD_CLOUD_COLORS[index % WORD_CLOUD_COLORS.length];
                  return (
                    <span key={word} className={`rounded-full px-4 py-1 ${style?.bg} ${style?.text}`}>
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div key={index} className='relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm'>
                  <div
                    className={`absolute inset-y-0 left-0 w-1 ${
                      ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'][index % 4]
                    }`}
                  />
                  <div className='space-y-4'>
                    <p className='text-gray-600'>"{testimonial.text}"</p>
                    <div>
                      <p className='font-medium'>Anonymous</p>
                      <div className='flex text-yellow-400'>{'★'.repeat(testimonial.rating)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
