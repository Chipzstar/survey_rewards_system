import { HydrateClient, trpc } from '~/trpc/server';
import { SurveyLink } from '~/app/(app)/survey/[id]/(protected)/share/survey-link';
import { cn } from '~/lib/utils';
import Image from 'next/image';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });
  const thumbnails = survey.rewards.filter(r => r.thumbnail).map(r => r.thumbnail) as string[];

  return (
    <HydrateClient>
      <div className='mx-auto max-w-3xl overflow-x-hidden py-12 text-white md:my-auto'>
        <div
          className={cn('grid grid-cols-1 place-items-center', {
            'lg:grid-cols-2 lg:gap-x-24': thumbnails.length
          })}
        >
          <section className={cn(thumbnails[0] ? 'block items-center' : 'hidden')}>
            <Image src={thumbnails[0]} alt='thumbnail' width={200} height={200} />
          </section>
          <section className='flex flex-col items-center space-y-6'>
            <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>🎉 Scan NOW!!! 🏆</h2>
            <SurveyLink surveyId={survey.id} surveyLink={survey.link} />
          </section>
        </div>
      </div>
    </HydrateClient>
  );
}
