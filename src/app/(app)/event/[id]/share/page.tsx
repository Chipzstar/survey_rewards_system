import Link from 'next/link';
import QRCode from 'react-qr-code';
import { env } from '@/env';

const { NEXT_PUBLIC_BASE_URL } = env;

export default function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const surveyLink = `${NEXT_PUBLIC_BASE_URL}/survey/${id}`;

  return (
    <main className='flex min-h-screen flex-col items-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <div className='mb-4 flex w-full items-center justify-between md:mb-8'>
        <h1 className='text-3xl font-bold md:text-4xl'>Event Analytics Dashboard: Fintech Conference Survey</h1>
        <Link href={`/event/${id}`} className='text-white underline'>
          Back to Analytics
        </Link>
        <Link href='/' className='text-white underline'>
          Home
        </Link>
      </div>
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
          <a href={surveyLink} className='break-words text-white underline'>
            {surveyLink}
          </a>
        </div>
      </div>
    </main>
  );
}
