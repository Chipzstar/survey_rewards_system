import { Button } from '~/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { HydrateClient, trpc } from '~/trpc/server';
import { differenceInSeconds } from 'date-fns';

export default async function WinnerAnnouncementPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await auth();

  const survey = await trpc.survey.byIdWithAnalytics({ id: Number(id) });
  const sortedResponses = survey.responses.sort((a, b) => {
    const timeA = differenceInSeconds(new Date(a.completed_at), new Date(a.started_at));
    const timeB = differenceInSeconds(new Date(b.completed_at), new Date(b.started_at));
    return timeA - timeB; // Sort ascending (lowest to highest)
  });

  // Winner data
  const winnerData = sortedResponses.slice(0, survey.number_of_winners).map((response, index) => {
    return {
      rank: index + 1,
      name: response.user_id,
      winnerRef: response.referrals || '#',
      points: response.points_earned,
      giftCardValue: survey.giftCards[0]?.value ?? '£30'
    };
  });

  return (
    <HydrateClient>
      <div className='m-auto'>
        <div className='flex flex-col items-center rounded-lg bg-white/10 p-6 shadow-lg'>
          <h2 className='mb-4 text-3xl font-bold text-white'>
            The £{survey.giftCards[0]!.value} giftcard winners are...
          </h2>
          <div className='mb-6 space-y-4'>
            {winnerData.map(winner => (
              <div key={winner.rank} className='flex flex-col items-center'>
                <h3 className='text-4xl font-bold text-white'>ID: {winner.name}</h3>
                <p className='text-lg text-gray-300'>
                  Rank: {winner.rank}, Total: {winner.points}
                </p>
                <Button className='mt-2 bg-tertiary hover:bg-tertiary/90'>Claim giftcard</Button>
              </div>
            ))}
          </div>
          <p className='mt-4 text-xs text-gray-300'>Powered by Genus</p>
        </div>
      </div>
    </HydrateClient>
  );
}
