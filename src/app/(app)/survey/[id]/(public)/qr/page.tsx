import { HydrateClient, trpc } from '~/trpc/server';
import { SurveyLink } from '~/components/ui/survey-link';
import { cn } from '~/lib/utils';
import Image from 'next/image';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithRewards({ id: Number(id) });
  const thumbnails = survey.rewards.filter(r => r.thumbnail).map(r => r.thumbnail) as string[];

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <div className='mx-auto max-w-3xl overflow-x-hidden py-12 text-white md:my-auto'>
          <div
            className={cn('grid grid-cols-1 place-items-center', {
              'lg:grid-cols-2 lg:gap-x-24': thumbnails.length
            })}
          >
            <section className={cn(thumbnails[0] ? 'block items-center' : 'hidden')}>
              <Image
                src={thumbnails[0]}
                alt='thumbnail'
                width={500}
                height={600}
                className='object-cover object-center'
              />
            </section>
            <section className='flex flex-col items-center space-y-6'>
              <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>🎉 Scan NOW!!! 🏆</h2>
              <SurveyLink surveyId={survey.id} surveyLink={survey.link} />
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
