import { HydrateClient, trpc } from '~/trpc/server';
import { genPasscode, genUserId } from '~/lib/utils';
import { SurveyLink } from '~/app/(app)/survey/[id]/(protected)/share/survey-link';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });

  return (
    <HydrateClient>
      <div className='overflow-x-hidden py-12 text-white md:my-auto'>
        <div className='flex flex-col items-center space-y-6'>
          <h2 className='text-balance text-center text-xl font-semibold text-[#6F42FF]'>
            🎉 Scan NOW and let the games begin! 🏆
          </h2>
          <SurveyLink surveyId={survey.id} surveyLink={survey.link} />
        </div>
      </div>
    </HydrateClient>
  );
}
