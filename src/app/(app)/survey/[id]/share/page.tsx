import Link from 'next/link';
import QRCode from 'react-qr-code';
import { env } from '~/env';
import { auth } from '@clerk/nextjs/server';
import { trpc } from '~/trpc/server';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  const surveyLink = `${survey.link}?id=${id}&start_time=${new Date().getTime()}`;

  return (
    <div className='m-auto text-white'>
      <div className='flex flex-col items-center'>
        <div className='mb-4 md:mb-8'>
          <QRCode
            value={surveyLink}
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='mb-4 text-2xl font-bold'>Link</h2>
          <Link href={surveyLink} className='break-words text-white underline' target='_blank'>
            {survey.link}
          </Link>
        </div>
      </div>
    </div>
  );
}
