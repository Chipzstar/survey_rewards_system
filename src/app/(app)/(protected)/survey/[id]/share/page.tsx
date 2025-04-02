import { HydrateClient, trpc } from '~/trpc/server';
import { SurveyLink } from '~/components/ui/survey-link';
import { cn } from '~/lib/utils';
import Image from 'next/image';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });
  const thumbnails = survey.rewards.filter(r => r.thumbnail).map(r => r.thumbnail) as string[];

  return (
    <HydrateClient>
      <main className='flex w-full flex-col p-6'>
        <div className='mb-6 flex flex-col space-y-4'>
          <h2 className='text-2xl'>Share QR</h2>
        </div>
        <div className='mx-auto w-full max-w-2xl overflow-x-hidden rounded-2xl bg-sidebar px-12 py-10 md:my-auto'>
          <section
            className={cn('mb-6 flex items-center', {
              'justify-center': !thumbnails.length,
              'justify-between': thumbnails.length
            })}
          >
            <div className='flex items-center gap-x-3'>
              <Image src='/icon/heart.svg' alt='Genus Logo' width={30} height={30} className='rounded-lg' />
              <h2 className='text-xl font-medium'>Share QR</h2>
            </div>
            <div className={cn(thumbnails[0] ? 'block items-center' : 'hidden')}>
              <Image src={thumbnails[0]} alt='thumbnail' width={300} height={300} />
            </div>
          </section>

          <section className='flex w-full flex-col items-center space-y-4 rounded-2xl bg-white px-8 py-6'>
            <Image src='/icon/scan.svg' alt='Genus Logo' width={30} height={30} className='rounded-lg' />
            <h2 className='text-semi-dark text-balance text-center text-xl font-medium'>Scan this QR Code</h2>
            <p className='pb-6 text-gray-500'>Scan this QR code to begin and get a reward! 🎁</p>
            <SurveyLink surveyId={survey.id} surveyLink={survey.link} />
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
