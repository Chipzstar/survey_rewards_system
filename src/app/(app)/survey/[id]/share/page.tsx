import Link from 'next/link';
import QRCode from 'react-qr-code';
import { env } from '~/env';
import { auth } from '@clerk/nextjs/server';
import { trpc } from '~/trpc/server';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  return (
    <main className='flex min-h-screen flex-col items-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
      <nav className='mb-4 flex w-full items-center justify-between md:mb-8'>
        <h1 className='text-3xl font-bold md:text-4xl'>{survey.name}</h1>
        <div className='flex items-center space-x-6'>
          <Link href={`/survey/${id}`} className='text-white underline'>
            Back to Analytics
          </Link>
          <Link href='/' className='text-white underline'>
            Home
          </Link>
        </div>
      </nav>
      <div className='flex flex-col items-center'>
        <div className='mb-4 md:mb-8'>
          <QRCode
            value={survey.link}
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='mb-4 text-2xl font-bold'>Link</h2>
          <Link href={survey.link} className='break-words text-white underline' target='_blank'>
            {survey.link}
          </Link>
        </div>
      </div>
    </main>
  );
}
