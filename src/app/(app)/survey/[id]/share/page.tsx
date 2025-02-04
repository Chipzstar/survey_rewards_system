import Link from 'next/link';
import QRCode from 'react-qr-code';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { isMobile } from 'react-device-detect';
import { genPasscode, genUserId } from '~/lib/utils';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  const user_id = genUserId();
  const passcode = genPasscode();
  const start_time = new Date().getTime();
  console.log({ start_time });
  const surveyLink = `${survey.link}?id=${id}&start_time=${start_time}&user_id=${user_id}&passcode=${passcode}`;

  return (
    <HydrateClient>
      <div className='m-auto text-white'>
        <div className='flex flex-col items-center space-y-6'>
          <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>
            🎉 Scan NOW! The Fastest win the MOST QR Points! 🏆
          </h2>
          <div className='mb-4 md:mb-8'>
            <QRCode
              value={surveyLink}
              size={256}
              className='max-w-full sm:max-w-2xl'
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              viewBox={`0 0 256 256`}
            />
          </div>
          {!isMobile && (
            <div className='flex flex-col items-center'>
              <h2 className='mb-4 text-2xl font-bold'>Link</h2>
              <Link href={surveyLink} className='break-words text-white underline' target='_blank'>
                {survey.link}
              </Link>
            </div>
          )}
        </div>
      </div>
    </HydrateClient>
  );
}
