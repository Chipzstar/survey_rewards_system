import { HydrateClient, trpc } from '~/trpc/server';
import { AnimatedQrStage } from './animated-qr-stage';

export default async function EventSharePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const survey = await trpc.survey.byIdWithRewards({ id: Number(id) });
  const thumbnails = (survey.rewardSurveys?.map(rs => rs.reward).filter(r => r.thumbnail).map(r => r.thumbnail) ?? []) as string[];

  return (
    <HydrateClient>
      <main className='flex min-h-screen flex-col bg-gradient-to-br from-primary to-secondary p-4 text-white md:p-24'>
        <AnimatedQrStage thumbnails={thumbnails} surveyId={survey.id} surveyLink={survey.link} />
      </main>
    </HydrateClient>
  );
}
